'use server'

import Groq from 'groq-sdk'
import { createClient } from '@/lib/supabase/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function generateWorkoutPlan(goal: string, daysPerWeek: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: exercises } = await supabase
    .from('exercises')
    .select('id, name, muscle_group')

  if (!exercises || exercises.length === 0) {
    return { error: 'No exercises available' }
  }

  const exerciseList = exercises
    .map((e) => `${e.id}|${e.name}|${e.muscle_group}`)
    .join('\n')

  const prompt = `You are a fitness coach. Create a ${daysPerWeek}-day-per-week workout plan for the goal: "${goal}".

Choose ONLY from this exercise list (format: id|name|muscle_group):
${exerciseList}

Respond ONLY with valid JSON, no markdown, no explanation, in this exact format:
{
  "title": "Plan title",
  "days": [
    {
      "day_label": "Day 1 - Push",
      "exercises": [
        { "exercise_id": "uuid-here", "sets": 3, "reps": 10 }
      ]
    }
  ]
}

Pick 4-6 exercises per day. Use real exercise_id values from the list above.`

  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  })

  const raw = completion.choices[0]?.message?.content || ''
  const cleaned = raw.replace(/```json|```/g, '').trim()

  let plan
  try {
    plan = JSON.parse(cleaned)
  } catch {
    return { error: 'Failed to parse AI response' }
  }

  const { data: gymMember } = await supabase
    .from('members')
    .select('gym_id')
    .eq('id', user.id)
    .single()

  const { data: workoutPlan, error: planError } = await supabase
    .from('workout_plans')
    .insert({
      gym_id: gymMember?.gym_id,
      member_id: user.id,
      title: plan.title,
      goal,
      ai_generated: true,
    })
    .select()
    .single()

  if (planError || !workoutPlan) {
    return { error: planError?.message || 'Failed to save plan' }
  }

  for (const day of plan.days) {
    for (let i = 0; i < day.exercises.length; i++) {
      const ex = day.exercises[i]
      await supabase.from('plan_exercises').insert({
        plan_id: workoutPlan.id,
        exercise_id: ex.exercise_id,
        sets: ex.sets,
        reps: ex.reps,
        order_index: i,
        day_label: day.day_label,
      })
    }
  }

  return { success: true, planId: workoutPlan.id }
}
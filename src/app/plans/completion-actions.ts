'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleExerciseCompletion(planExerciseId: string, isCompleted: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const today = new Date().toISOString().split('T')[0]

  if (isCompleted) {
    const { error } = await supabase.from('exercise_completions').insert({
      member_id: user.id,
      plan_exercise_id: planExerciseId,
      completed_on: today,
    })
    if (error && !error.message.includes('duplicate')) {
      return { error: error.message }
    }
  } else {
    const { error } = await supabase
      .from('exercise_completions')
      .delete()
      .eq('member_id', user.id)
      .eq('plan_exercise_id', planExerciseId)
      .eq('completed_on', today)

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath('/plans')
  revalidatePath('/progress')
  return { success: true }
}
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PlanGenerator from './PlanGenerator'
import ExerciseCheckbox from './ExerciseCheckbox'

export default async function PlansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: plans } = await supabase
    .from('workout_plans')
    .select('*, plan_exercises(*, exercises(name))')
    .eq('member_id', user.id)
    .order('created_at', { ascending: false })

  const today = new Date().toISOString().split('T')[0]
  const { data: completions } = await supabase
    .from('exercise_completions')
    .select('plan_exercise_id')
    .eq('member_id', user.id)
    .eq('completed_on', today)

  const completedIds = new Set(completions?.map((c) => c.plan_exercise_id))

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <a href="/dashboard" className="text-sm text-gray-400">&larr; Back to Dashboard</a>
      <h1 className="text-2xl font-bold mt-2 mb-6">Workout Plans</h1>

      <PlanGenerator />

      <div className="mt-10 space-y-6">
        {plans?.map((plan) => {
          const dayGroups: Record<string, typeof plan.plan_exercises> = {}
          plan.plan_exercises?.forEach((pe: any) => {
            const label = pe.day_label || 'Day 1'
            if (!dayGroups[label]) dayGroups[label] = []
            dayGroups[label].push(pe)
          })

          return (
            <div key={plan.id} className="rounded-lg border border-gray-700 p-4">
              <h2 className="text-lg font-semibold">{plan.title}</h2>
              <p className="text-sm text-gray-400 mb-3">Goal: {plan.goal}</p>

              {Object.entries(dayGroups).map(([day, exList]) => (
                <div key={day} className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">{day}</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    {exList
                      .sort((a: any, b: any) => a.order_index - b.order_index)
                      .map((pe: any) => (
                        <li key={pe.id} className="flex items-center gap-2">
                          <ExerciseCheckbox
                            planExerciseId={pe.id}
                            initialChecked={completedIds.has(pe.id)}
                          />
                          <span>
                            {pe.exercises?.name} — {pe.sets} sets x {pe.reps} reps
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
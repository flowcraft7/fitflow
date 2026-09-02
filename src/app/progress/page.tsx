import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProgressLogger from './ProgressLogger'
import ProgressChart from './ProgressChart'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: logs } = await supabase
    .from('progress_logs')
    .select('*')
    .eq('member_id', user.id)
    .order('logged_at', { ascending: true })

  const { count: completedCount } = await supabase
    .from('exercise_completions')
    .select('*', { count: 'exact', head: true })
    .eq('member_id', user.id)

  const { data: completions } = await supabase
    .from('exercise_completions')
    .select('completed_on, plan_exercises(day_label, exercises(name))')
    .eq('member_id', user.id)
    .order('completed_on', { ascending: false })

  const byDate: Record<string, any[]> = {}
  completions?.forEach((c: any) => {
    if (!byDate[c.completed_on]) byDate[c.completed_on] = []
    byDate[c.completed_on].push(c)
  })

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <a href="/dashboard" className="text-sm text-gray-400">&larr; Back to Dashboard</a>
      <h1 className="text-2xl font-bold mt-2 mb-6">Progress</h1>

      <div className="rounded-lg border border-gray-700 p-4 mb-6">
        <p className="text-sm text-gray-400">Total exercises completed</p>
        <p className="text-3xl font-bold mt-1">{completedCount || 0}</p>
      </div>

      <ProgressLogger />

      {logs && logs.length > 0 && (
        <div className="mt-8">
          <ProgressChart logs={logs} />
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-semibold mb-3">Weight/Steps History</h2>
        <div className="space-y-2">
          {logs?.slice().reverse().map((log) => (
            <div key={log.id} className="rounded-lg border border-gray-700 p-3 text-sm flex justify-between">
              <span className="text-gray-400">
                {new Date(log.logged_at).toLocaleDateString()}
              </span>
              <span>
                {log.weight_kg ? `${log.weight_kg} kg` : ''}
                {log.weight_kg && log.steps ? ' · ' : ''}
                {log.steps ? `${log.steps} steps` : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-semibold mb-3">Workout Log</h2>
        <div className="space-y-4">
          {Object.entries(byDate).map(([date, items]) => (
            <div key={date} className="rounded-lg border border-gray-700 p-3">
              <p className="text-sm text-gray-400 mb-2">
                {new Date(date).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <ul className="text-sm space-y-1">
                {items.map((item: any, i: number) => (
                  <li key={i}>
                    {item.plan_exercises?.exercises?.name}
                    {item.plan_exercises?.day_label ? ` (${item.plan_exercises.day_label})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {Object.keys(byDate).length === 0 && (
            <p className="text-sm text-gray-500">No workouts logged yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
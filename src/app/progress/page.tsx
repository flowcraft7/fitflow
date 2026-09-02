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

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <a href="/dashboard" className="text-sm text-gray-400">&larr; Back to Dashboard</a>
      <h1 className="text-2xl font-bold mt-2 mb-6">Progress</h1>

      <ProgressLogger />

      {logs && logs.length > 0 && (
        <div className="mt-8">
          <ProgressChart logs={logs} />
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-semibold mb-3">History</h2>
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
    </div>
  )
}
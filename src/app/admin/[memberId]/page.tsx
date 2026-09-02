import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AssignPlanForm from './AssignPlanForm'

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ memberId: string }>
}) {
  const { memberId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: currentMember } = await supabase
    .from('members')
    .select('role, gym_id')
    .eq('id', user.id)
    .single()

  if (!currentMember || currentMember.role !== 'admin') redirect('/dashboard')

  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('id', memberId)
    .single()

  const { data: logs } = await supabase
    .from('progress_logs')
    .select('*')
    .eq('member_id', memberId)
    .order('logged_at', { ascending: false })

  const { data: plans } = await supabase
    .from('workout_plans')
    .select('*, plan_exercises(*, exercises(name))')
    .eq('member_id', memberId)
    .order('created_at', { ascending: false })

  const { data: exercises } = await supabase
    .from('exercises')
    .select('id, name, muscle_group')

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <a href="/admin" className="text-sm text-gray-400">&larr; Back to Admin</a>
      <h1 className="text-2xl font-bold mt-2 mb-6">{member?.full_name || 'Member'}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-3">Weight/Steps Log</h2>
          <div className="space-y-2">
            {logs?.map((log) => (
              <div key={log.id} className="rounded-md border border-gray-700 p-2 text-sm flex justify-between">
                <span className="text-gray-400">{new Date(log.logged_at).toLocaleDateString()}</span>
                <span>
                  {log.weight_kg ? `${log.weight_kg} kg` : ''}
                  {log.steps ? ` · ${log.steps} steps` : ''}
                </span>
              </div>
            ))}
            {(!logs || logs.length === 0) && (
              <p className="text-gray-500 text-sm">No logs yet.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-3">Workout Plans</h2>
          <div className="space-y-3">
            {plans?.map((plan) => (
              <div key={plan.id} className="rounded-md border border-gray-700 p-3 text-sm">
                <p className="font-semibold">{plan.title}</p>
                <p className="text-gray-400 text-xs mb-2">{plan.goal}</p>
                <ul className="text-gray-400 space-y-1">
                  {plan.plan_exercises?.map((pe: any) => (
                    <li key={pe.id}>
                      {pe.exercises?.name} — {pe.sets}x{pe.reps}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {(!plans || plans.length === 0) && (
              <p className="text-gray-500 text-sm">No plans yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <AssignPlanForm memberId={memberId} exercises={exercises || []} />
      </div>
    </div>
  )
}
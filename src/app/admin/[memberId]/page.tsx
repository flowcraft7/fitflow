import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AssignPlanForm from './AssignPlanForm'
import Nav from '@/components/Nav'

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
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-6 max-w-4xl mx-auto">
      <Nav backHref="/admin" backLabel="Admin" />

      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-[var(--color-accent)] rounded-full" />
        <h1 className="text-3xl font-bold tracking-tight">{member?.full_name || 'Member'}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
            Weight/Steps Log
          </h2>
          <div className="space-y-2">
            {logs?.map((log) => (
              <div
                key={log.id}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-sm flex justify-between"
              >
                <span className="text-[var(--color-text-muted)]">{new Date(log.logged_at).toLocaleDateString()}</span>
                <span>
                  {log.weight_kg ? `${log.weight_kg} kg` : ''}
                  {log.steps ? ` · ${log.steps} steps` : ''}
                </span>
              </div>
            ))}
            {(!logs || logs.length === 0) && (
              <p className="text-[var(--color-text-muted)] text-sm">No logs yet.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
            Workout Plans
          </h2>
          <div className="space-y-3">
            {plans?.map((plan) => (
              <div key={plan.id} className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm">
                <p className="font-semibold">{plan.title}</p>
                <p className="text-[var(--color-text-muted)] text-xs mb-2">{plan.goal}</p>
                <ul className="text-[var(--color-text-muted)] space-y-1">
                  {plan.plan_exercises?.map((pe: any) => (
                    <li key={pe.id}>
                      {pe.exercises?.name} — {pe.sets}x{pe.reps}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {(!plans || plans.length === 0) && (
              <p className="text-[var(--color-text-muted)] text-sm">No plans yet.</p>
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
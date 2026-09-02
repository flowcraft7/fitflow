import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SubscriptionEditor from './SubscriptionEditor'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: currentMember } = await supabase
    .from('members')
    .select('role, gym_id')
    .eq('id', user.id)
    .single()

  if (!currentMember || currentMember.role !== 'admin') {
    redirect('/dashboard')
  }

  const { data: gym } = await supabase
    .from('gyms')
    .select('*')
    .eq('id', currentMember.gym_id)
    .single()

  const { data: members } = await supabase
    .from('members')
    .select('id, full_name, role, created_at, subscription_status, subscription_expires_on')
    .eq('gym_id', currentMember.gym_id)
    .order('created_at', { ascending: false })

  const { data: recentWorkouts } = await supabase
    .from('exercise_completions')
    .select('member_id, completed_on')
    .in('member_id', members?.map((m) => m.id) || [])
    .gte('completed_on', new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0])

  const activityCount: Record<string, number> = {}
  recentWorkouts?.forEach((r) => {
    activityCount[r.member_id] = (activityCount[r.member_id] || 0) + 1
  })

  const today = new Date().toISOString().split('T')[0]

  function computeStatus(m: any) {
    if (m.subscription_expires_on && m.subscription_expires_on < today) {
      return 'expired'
    }
    return m.subscription_status
  }

  const activeCount = members?.filter((m) => computeStatus(m) === 'active').length || 0

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <a href="/dashboard" className="text-sm text-gray-400">&larr; Back to Dashboard</a>
      <h1 className="text-2xl font-bold mt-2 mb-1">{gym?.name} — Admin</h1>
      <p className="text-gray-400 mb-6">
        {members?.length || 0} members · {activeCount} paid/active
      </p>

      <div className="rounded-lg border border-gray-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Workouts (7d)</th>
              <th className="p-3">Subscription</th>
            </tr>
          </thead>
          <tbody>
            {members?.map((m) => (
              <tr key={m.id} className="border-t border-gray-800">
                <td className="p-3">{m.full_name || '—'}</td>
                <td className="p-3 capitalize">{m.role}</td>
                <td className="p-3 text-gray-400">
                  {new Date(m.created_at).toLocaleDateString()}
                </td>
                <td className="p-3">{activityCount[m.id] || 0}</td>
                <td className="p-3">
                  <SubscriptionEditor
                    memberId={m.id}
                    currentStatus={computeStatus(m)}
                    currentExpiresOn={m.subscription_expires_on}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminMemberTable from './AdminMemberTable'
import AddMemberForm from './AddMemberForm'
import AnnouncementBoard from './AnnouncementBoard'
import RevenuePanel from './RevenuePanel'

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

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('gym_id', currentMember.gym_id)
    .order('created_at', { ascending: false })

  const today = new Date().toISOString().split('T')[0]
  const activeCount =
    members?.filter((m) => {
      if (m.subscription_expires_on && m.subscription_expires_on < today) return false
      return m.subscription_status === 'active'
    }).length || 0

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <a href="/dashboard" className="text-sm text-gray-400">&larr; Back to Dashboard</a>
      <h1 className="text-2xl font-bold mt-2 mb-1">{gym?.name} — Admin</h1>
      <p className="text-gray-400 mb-6">{members?.length || 0} members</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <RevenuePanel currentPrice={gym?.price_per_member || 0} activeCount={activeCount} />
        <AddMemberForm />
      </div>

      <AnnouncementBoard announcements={announcements || []} />

      <div className="mt-6">
        <AdminMemberTable members={members || []} activityCount={activityCount} />
      </div>
    </div>
  )
}
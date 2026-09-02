import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentGym } from '@/lib/get-current-gym'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const gym = await getCurrentGym()

  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('gym_id', member?.gym_id)
    .order('created_at', { ascending: false })
    .limit(5)

  const welcomeName = member?.full_name ? `, ${member.full_name}` : ''

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold">Welcome{welcomeName}</h1>
      {gym && <p className="text-gray-400 mt-1">{gym.name}</p>}

      {announcements && announcements.length > 0 && (
        <div className="mt-6 rounded-lg border border-gray-700 p-4">
          <h2 className="font-semibold mb-3">Announcements</h2>
          <div className="space-y-2">
            {announcements.map((a) => (
              <div key={a.id} className="text-sm bg-gray-900 rounded-md p-2">
                <p>{a.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(a.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <a href="/exercises" className="rounded-lg border border-gray-700 p-4 hover:bg-gray-900">
          <h2 className="font-semibold">Exercise Library</h2>
          <p className="text-sm text-gray-400">Browse exercises by muscle group</p>
        </a>
        <a href="/plans" className="rounded-lg border border-gray-700 p-4 hover:bg-gray-900">
          <h2 className="font-semibold">Workout Plans</h2>
          <p className="text-sm text-gray-400">Your plans & AI-generated routines</p>
        </a>
        <a href="/progress" className="rounded-lg border border-gray-700 p-4 hover:bg-gray-900">
          <h2 className="font-semibold">Progress</h2>
          <p className="text-sm text-gray-400">Weight, steps & measurements</p>
        </a>
        {member?.role === 'admin' && (
          <a href="/admin" className="rounded-lg border border-gray-700 p-4 hover:bg-gray-900">
            <h2 className="font-semibold">Admin Panel</h2>
            <p className="text-sm text-gray-400">Manage gym members</p>
          </a>
        )}
      </div>
    </div>
  )
}
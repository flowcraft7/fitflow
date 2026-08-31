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

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold">
        Welcome{member?.full_name ? ,  : ''}
      </h1>
      {gym && <p className="text-gray-400 mt-1">{gym.name}</p>}

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
      </div>
    </div>
  )
}

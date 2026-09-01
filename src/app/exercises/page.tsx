import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ExercisesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .order('muscle_group')

  const grouped: Record<string, typeof exercises> = {}
  exercises?.forEach((ex) => {
    if (!grouped[ex.muscle_group]) grouped[ex.muscle_group] = []
    grouped[ex.muscle_group]!.push(ex)
  })

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <a href="/dashboard" className="text-sm text-gray-400">&larr; Back to Dashboard</a>
      <h1 className="text-2xl font-bold mt-2 mb-6">Exercise Library</h1>

      {Object.entries(grouped).map(([group, list]) => (
        <div key={group} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-300 mb-3">{group}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {list?.map((ex) => (
              <div key={ex.id} className="rounded-lg border border-gray-700 overflow-hidden">
                {ex.media_url && (
                  <img src={ex.media_url} alt={ex.name} className="w-full h-40 object-cover" />
                )}
                <div className="p-3">
                  <h3 className="font-semibold">{ex.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{ex.instructions}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
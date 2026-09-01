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
              <div key={ex.id} className="rounded-lg border border-gray-700 overflow-hidden flex flex-col">
                {ex.media_url ? (
                  <img src={ex.media_url} alt={ex.name} className="w-full h-40 object-cover bg-gray-900" />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-gray-900 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6.5 6.5 17.5 17.5" />
                      <path d="M21 21l-1-1" />
                      <path d="M3 3l1 1" />
                      <path d="M18 22l4-4" />
                      <path d="M2 6l4-4" />
                      <path d="M3 10l7-7" />
                      <path d="M14 21l7-7" />
                    </svg>
                  </div>
                )}
                <div className="p-3 flex-1">
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
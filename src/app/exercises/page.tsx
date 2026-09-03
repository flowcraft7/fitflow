import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import ExerciseImage from './ExerciseImage'

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
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-6 max-w-6xl mx-auto">
      <Nav backHref="/dashboard" />

      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-[var(--color-warn)] rounded-full" />
        <h1 className="text-3xl font-bold tracking-tight">Exercise Library</h1>
      </div>

      {Object.entries(grouped).map(([group, list]) => (
        <div key={group} className="mb-10">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
            {group}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {list?.map((ex) => (
              <div
                key={ex.id}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden flex flex-col hover:border-[var(--color-warn)] transition-colors"
              >
                <div className="w-full h-48 bg-black">
                  <ExerciseImage src={ex.media_url} alt={ex.name} />
                </div>
                <div className="p-4 flex-1">
                  <h3 className="font-semibold">{ex.name}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">{ex.instructions}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
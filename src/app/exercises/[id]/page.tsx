import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import ExerciseImage from '../ExerciseImage'

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: exercise } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .single()

  if (!exercise) {
    notFound()
  }

  const { data: related } = await supabase
    .from('exercises')
    .select('id, name, media_url')
    .eq('muscle_group', exercise.muscle_group)
    .neq('id', id)
    .limit(4)

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-6 max-w-4xl mx-auto">
      <Nav backHref="/exercises" backLabel="Exercise Library" />

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="w-full h-72 bg-black">
          <ExerciseImage src={exercise.media_url} alt={exercise.name} />
        </div>
        <div className="p-6">
          <span className="text-xs font-semibold text-[var(--color-warn)] uppercase tracking-wide">
            {exercise.muscle_group}
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-1 mb-4">{exercise.name}</h1>
          <p className="text-[var(--color-text-muted)] leading-relaxed">{exercise.instructions}</p>
        </div>
      </div>

      {related && related.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
            More {exercise.muscle_group} exercises
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map((r) => (
              <a
                key={r.id}
                href={`/exercises/${r.id}`}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-[var(--color-warn)] transition-colors"
              >
                <div className="w-full h-24 bg-black">
                  <ExerciseImage src={r.media_url} alt={r.name} />
                </div>
                <p className="p-2 text-xs font-medium truncate">{r.name}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
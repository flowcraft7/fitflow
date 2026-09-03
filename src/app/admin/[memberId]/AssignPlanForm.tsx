'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { assignPlanToMember } from '../member-actions'

export default function AssignPlanForm({
  memberId,
  exercises,
}: {
  memberId: string
  exercises: { id: string; name: string; muscle_group: string }[]
}) {
  const [title, setTitle] = useState('')
  const [dayLabel, setDayLabel] = useState('Day 1')
  const [selected, setSelected] = useState<{ exercise_id: string; sets: number; reps: number }[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const addExercise = (exerciseId: string) => {
    if (selected.find((s) => s.exercise_id === exerciseId)) return
    setSelected([...selected, { exercise_id: exerciseId, sets: 3, reps: 10 }])
  }

  const removeExercise = (exerciseId: string) => {
    setSelected(selected.filter((s) => s.exercise_id !== exerciseId))
  }

  const handleSubmit = async () => {
    if (!title || selected.length === 0) return
    setLoading(true)
    await assignPlanToMember(
      memberId,
      title,
      selected.map((s) => ({ ...s, day_label: dayLabel }))
    )
    setTitle('')
    setSelected([])
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="font-semibold mb-4">Assign Custom Plan</h2>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Plan title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
        />
        <input
          type="text"
          placeholder="Day label"
          value={dayLabel}
          onChange={(e) => setDayLabel(e.target.value)}
          className="w-32 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
        />
      </div>

      <select
        onChange={(e) => e.target.value && addExercise(e.target.value)}
        value=""
        className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm mb-3 focus:outline-none focus:border-[var(--color-accent)]"
      >
        <option value="">+ Add exercise</option>
        {exercises.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.name} ({ex.muscle_group})
          </option>
        ))}
      </select>

      <div className="space-y-2 mb-4">
        {selected.map((s) => {
          const ex = exercises.find((e) => e.id === s.exercise_id)
          return (
            <div
              key={s.exercise_id}
              className="flex items-center gap-2 text-sm bg-[var(--color-bg)] rounded-md p-2 border border-[var(--color-border)]"
            >
              <span className="flex-1">{ex?.name}</span>
              <input
                type="number"
                value={s.sets}
                onChange={(e) =>
                  setSelected(
                    selected.map((x) =>
                      x.exercise_id === s.exercise_id ? { ...x, sets: Number(e.target.value) } : x
                    )
                  )
                }
                className="w-14 bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-1 py-1"
              />
              <span className="text-[var(--color-text-muted)]">sets x</span>
              <input
                type="number"
                value={s.reps}
                onChange={(e) =>
                  setSelected(
                    selected.map((x) =>
                      x.exercise_id === s.exercise_id ? { ...x, reps: Number(e.target.value) } : x
                    )
                  )
                }
                className="w-14 bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-1 py-1"
              />
              <span className="text-[var(--color-text-muted)]">reps</span>
              <button
                onClick={() => removeExercise(s.exercise_id)}
                className="text-red-400 text-xs ml-2"
              >
                Remove
              </button>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !title || selected.length === 0}
        className="bg-[var(--color-accent)] text-[var(--color-accent-text)] rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {loading ? 'Saving...' : 'Assign Plan'}
      </button>
    </div>
  )
}
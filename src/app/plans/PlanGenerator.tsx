'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateWorkoutPlan } from './actions'

export default function PlanGenerator() {
  const [goal, setGoal] = useState('Muscle Gain')
  const [days, setDays] = useState(3)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleGenerate = async () => {
    setLoading(true)
    setError('')

    const result = await generateWorkoutPlan(goal, days)

    if (result.error) {
      setError(result.error)
    } else {
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="font-semibold mb-4">Generate a Custom Plan</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
        >
          <option>Muscle Gain</option>
          <option>Fat Loss</option>
          <option>Strength</option>
          <option>General Fitness</option>
        </select>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
        >
          <option value={2}>2 days/week</option>
          <option value={3}>3 days/week</option>
          <option value={4}>4 days/week</option>
          <option value={5}>5 days/week</option>
        </select>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-[var(--color-accent)] text-[var(--color-accent-text)] rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logProgress } from './actions'

export default function ProgressLogger() {
  const [weight, setWeight] = useState('')
  const [steps, setSteps] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await logProgress(
      weight ? parseFloat(weight) : null,
      steps ? parseInt(steps) : null,
      notes
    )

    if (result.error) {
      setError(result.error)
    } else {
      setWeight('')
      setSteps('')
      setNotes('')
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-700 p-4">
      <h2 className="font-semibold mb-3">Log Today</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="number"
          step="0.1"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm flex-1"
        />
        <input
          type="number"
          placeholder="Steps"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm flex-1"
        />
        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm flex-1"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-white text-black rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Log Entry'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  )
}
'use client'

import { useState } from 'react'
import { toggleExerciseCompletion } from './completion-actions'

export default function ExerciseCheckbox({
  planExerciseId,
  initialChecked,
}: {
  planExerciseId: string
  initialChecked: boolean
}) {
  const [checked, setChecked] = useState(initialChecked)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    const newState = !checked
    setChecked(newState)
    setLoading(true)
    await toggleExerciseCompletion(planExerciseId, newState)
    setLoading(false)
  }

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={handleToggle}
      disabled={loading}
      className="w-4 h-4 accent-white"
    />
  )
}
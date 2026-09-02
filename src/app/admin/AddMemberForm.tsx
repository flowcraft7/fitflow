'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addMemberManually } from './member-actions'

export default function AddMemberForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const result = await addMemberManually(name, email, password)

    if (result.error) {
      setError(result.error)
    } else {
      setName('')
      setEmail('')
      setPassword('')
      setSuccess(true)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-700 p-4">
      <h2 className="font-semibold mb-3">Add Walk-in Member</h2>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Temporary password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black rounded-md px-3 py-2 text-sm font-semibold disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Member'}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      {success && <p className="text-green-400 text-xs mt-2">Member added.</p>}
    </form>
  )
}
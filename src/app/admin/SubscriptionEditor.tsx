'use client'

import { useState } from 'react'
import { updateSubscription } from './actions'

export default function SubscriptionEditor({
  memberId,
  currentStatus,
  currentExpiresOn,
}: {
  memberId: string
  currentStatus: string
  currentExpiresOn: string | null
}) {
  const [status, setStatus] = useState(currentStatus)
  const [expiresOn, setExpiresOn] = useState(currentExpiresOn || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    await updateSubscription(memberId, status as any, expiresOn || null)
    setLoading(false)
  }

  const statusColor =
    status === 'active' ? 'text-green-400' : status === 'expired' ? 'text-red-400' : 'text-gray-400'

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className={`bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs ${statusColor}`}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="expired">Expired</option>
      </select>
      <input
        type="date"
        value={expiresOn}
        onChange={(e) => setExpiresOn(e.target.value)}
        className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs"
      />
      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-white text-black rounded px-2 py-1 text-xs font-semibold disabled:opacity-50"
      >
        {loading ? '...' : 'Save'}
      </button>
    </div>
  )
}
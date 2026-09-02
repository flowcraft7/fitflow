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

  const statusColor =
    status === 'active' ? 'text-green-400' : status === 'expired' ? 'text-red-400' : 'text-gray-400'

  const handleMarkPaid = async () => {
    setLoading(true)
    const newExpiry = new Date()
    newExpiry.setMonth(newExpiry.getMonth() + 1)
    const newExpiryStr = newExpiry.toISOString().split('T')[0]

    setStatus('active')
    setExpiresOn(newExpiryStr)
    await updateSubscription(memberId, 'active', newExpiryStr)
    setLoading(false)
  }

  const handleMarkInactive = async () => {
    setLoading(true)
    setStatus('inactive')
    setExpiresOn('')
    await updateSubscription(memberId, 'inactive', null)
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-semibold capitalize ${statusColor}`}>{status}</span>
      {expiresOn && (
        <span className="text-xs text-gray-500">until {new Date(expiresOn).toLocaleDateString()}</span>
      )}
      <button
        onClick={handleMarkPaid}
        disabled={loading}
        className="bg-white text-black rounded px-2 py-1 text-xs font-semibold disabled:opacity-50"
      >
        Mark Paid (+1mo)
      </button>
      <button
        onClick={handleMarkInactive}
        disabled={loading}
        className="bg-gray-800 text-white rounded px-2 py-1 text-xs disabled:opacity-50"
      >
        Deactivate
      </button>
    </div>
  )
}
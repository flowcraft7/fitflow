'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePricePerMember } from './member-actions'

export default function RevenuePanel({
  currentPrice,
  activeCount,
}: {
  currentPrice: number
  activeCount: number
}) {
  const [price, setPrice] = useState(currentPrice.toString())
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    await updatePricePerMember(parseFloat(price) || 0)
    router.refresh()
    setLoading(false)
  }

  const revenue = (parseFloat(price) || 0) * activeCount

  return (
    <div className="rounded-lg border border-gray-700 p-4">
      <h2 className="font-semibold mb-3">Revenue</h2>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-gray-400">Price per member/month:</span>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-24 bg-gray-900 border border-gray-700 rounded-md px-2 py-1 text-sm"
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-white text-black rounded-md px-3 py-1 text-xs font-semibold disabled:opacity-50"
        >
          Save
        </button>
      </div>
      <p className="text-sm text-gray-400">Active members: {activeCount}</p>
      <p className="text-2xl font-bold mt-1">Rs {revenue.toLocaleString()}/mo</p>
    </div>
  )
}
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
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <h2 className="font-semibold mb-3">Revenue</h2>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-[var(--color-text-muted)]">Price/member/month:</span>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-24 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-2 py-1 text-sm focus:outline-none focus:border-[var(--color-accent)]"
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[var(--color-accent)] text-[var(--color-accent-text)] rounded-md px-3 py-1 text-xs font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          Save
        </button>
      </div>
      <p className="text-sm text-[var(--color-text-muted)]">Active members: {activeCount}</p>
      <p className="text-3xl font-bold mt-1 text-[var(--color-positive)]">Rs {revenue.toLocaleString()}/mo</p>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { deleteMember } from './member-actions'
import SubscriptionEditor from './SubscriptionEditor'

export default function AdminMemberTable({
  members,
  activityCount,
}: {
  members: any[]
  activityCount: Record<string, number>
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  function computeStatus(m: any) {
    if (m.subscription_expires_on && m.subscription_expires_on < today) return 'expired'
    return m.subscription_status
  }

  const filtered = members.filter((m) => {
    const matchesSearch = (m.full_name || '').toLowerCase().includes(search.toLowerCase())
    const status = computeStatus(m)
    const matchesFilter = filter === 'all' || status === filter
    return matchesSearch && matchesFilter
  })

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove ${name || 'this member'}? This cannot be undone.`)) return
    setDeletingId(id)
    await deleteMember(id)
    setDeletingId(null)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm flex-1 focus:outline-none focus:border-[var(--color-accent)]"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-bg)] text-left">
            <tr>
              <th className="p-3 text-[var(--color-text-muted)] font-medium">Name</th>
              <th className="p-3 text-[var(--color-text-muted)] font-medium">Role</th>
              <th className="p-3 text-[var(--color-text-muted)] font-medium">Joined</th>
              <th className="p-3 text-[var(--color-text-muted)] font-medium">Workouts (7d)</th>
              <th className="p-3 text-[var(--color-text-muted)] font-medium">Subscription</th>
              <th className="p-3 text-[var(--color-text-muted)] font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-t border-[var(--color-border)]">
                <td className="p-3">
                  <a href={`/admin/${m.id}`} className="hover:text-[var(--color-accent)] transition-colors">
                    {m.full_name || '—'}
                  </a>
                </td>
                <td className="p-3 capitalize">{m.role}</td>
                <td className="p-3 text-[var(--color-text-muted)]">
                  {new Date(m.created_at).toLocaleDateString()}
                </td>
                <td className="p-3">{activityCount[m.id] || 0}</td>
                <td className="p-3">
                  <SubscriptionEditor
                    memberId={m.id}
                    currentStatus={computeStatus(m)}
                    currentExpiresOn={m.subscription_expires_on}
                  />
                </td>
                <td className="p-3">
                  {m.role !== 'admin' && (
                    <button
                      onClick={() => handleDelete(m.id, m.full_name)}
                      disabled={deletingId === m.id}
                      className="text-red-400 text-xs hover:underline disabled:opacity-50"
                    >
                      {deletingId === m.id ? 'Removing...' : 'Remove'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-3 text-center text-[var(--color-text-muted)]">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ProgressChart({ logs }: { logs: any[] }) {
  const data = logs
    .filter((l) => l.weight_kg)
    .map((l) => ({
      date: new Date(l.logged_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      weight: l.weight_kg,
    }))

  if (data.length < 2) return null

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="font-semibold mb-4">Weight Trend</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a28" />
          <XAxis dataKey="date" stroke="#8a8a85" fontSize={12} />
          <YAxis stroke="#8a8a85" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #2a2a28', borderRadius: '8px' }} />
          <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
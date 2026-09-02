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
    <div className="rounded-lg border border-gray-700 p-4">
      <h2 className="font-semibold mb-3">Weight Trend</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
          <Line type="monotone" dataKey="weight" stroke="#ffffff" strokeWidth={2} dot={{ fill: '#ffffff' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
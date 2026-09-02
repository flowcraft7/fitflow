'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { postAnnouncement, deleteAnnouncement } from './member-actions'

export default function AnnouncementBoard({ announcements }: { announcements: any[] }) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePost = async () => {
    if (!message.trim()) return
    setLoading(true)
    await postAnnouncement(message)
    setMessage('')
    router.refresh()
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    await deleteAnnouncement(id)
    router.refresh()
  }

  return (
    <div className="rounded-lg border border-gray-700 p-4">
      <h2 className="font-semibold mb-3">Announcements</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Write an announcement..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm"
        />
        <button
          onClick={handlePost}
          disabled={loading}
          className="bg-white text-black rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
          Post
        </button>
      </div>
      <div className="space-y-2">
        {announcements.map((a) => (
          <div key={a.id} className="flex justify-between items-start bg-gray-900 rounded-md p-2 text-sm">
            <div>
              <p>{a.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(a.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(a.id)}
              className="text-red-400 text-xs hover:underline ml-3"
            >
              Delete
            </button>
          </div>
        ))}
        {announcements.length === 0 && (
          <p className="text-gray-500 text-sm">No announcements yet.</p>
        )}
      </div>
    </div>
  )
}
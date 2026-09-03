'use client'

import { useState } from 'react'

export default function ExerciseImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[var(--color-surface)] text-[var(--color-text-muted)]">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 6.5 17.5 17.5" />
          <path d="M21 21l-1-1" />
          <path d="M3 3l1 1" />
          <path d="M18 22l4-4" />
          <path d="M2 6l4-4" />
          <path d="M3 10l7-7" />
          <path d="M14 21l7-7" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  )
}
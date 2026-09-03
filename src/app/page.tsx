export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col">
      <nav className="p-6 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span className="text-xl font-bold tracking-tight">FitFlow</span>
        
        <a
          href="/login"
          className="text-sm font-semibold bg-[var(--color-accent)] text-[var(--color-accent-text)] px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          Sign In
        </a>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-2xl mx-auto">
        <div className="w-1 h-8 bg-[var(--color-accent)] rounded-full mb-4" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Your gym, your plan, your progress.
        </h1>
        <p className="text-[var(--color-text-muted)] text-lg mb-8">
          A branded fitness app for your gym — AI-generated workout plans, exercise library,
          and progress tracking, all in one place.
        </p>
        
        <a
          href="/login"
          className="bg-[var(--color-accent)] text-[var(--color-accent-text)] px-8 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
        >
          Get Started
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto w-full px-6 pb-12">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="w-9 h-9 rounded-md bg-[var(--color-warn)]/15 flex items-center justify-center mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-warn)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 6.5 17.5 17.5" />
              <path d="M21 21l-1-1" />
              <path d="M3 3l1 1" />
              <path d="M18 22l4-4" />
              <path d="M2 6l4-4" />
              <path d="M3 10l7-7" />
              <path d="M14 21l7-7" />
            </svg>
          </div>
          <h3 className="font-semibold mb-1">Exercise Library</h3>
          <p className="text-sm text-[var(--color-text-muted)]">Browse exercises by muscle group with real demos.</p>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="w-9 h-9 rounded-md bg-[var(--color-accent)]/15 flex items-center justify-center mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <h3 className="font-semibold mb-1">AI Workout Plans</h3>
          <p className="text-sm text-[var(--color-text-muted)]">Personalized plans based on your goal.</p>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="w-9 h-9 rounded-md bg-[var(--color-positive)]/15 flex items-center justify-center mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            </svg>
          </div>
          <h3 className="font-semibold mb-1">Progress Tracking</h3>
          <p className="text-sm text-[var(--color-text-muted)]">Log weight, steps, and see your trend.</p>
        </div>
      </div>
    </div>
  )
}
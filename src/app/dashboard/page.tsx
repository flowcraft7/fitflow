import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentGym } from '@/lib/get-current-gym'
import Nav from '@/components/Nav'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const gym = await getCurrentGym()

  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('gym_id', member?.gym_id)
    .order('created_at', { ascending: false })
    .limit(5)

  const welcomeName = member?.full_name ? `, ${member.full_name}` : ''

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-6 max-w-4xl mx-auto">
      <Nav gymName={gym?.name} />

      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-[var(--color-accent)] rounded-full" />
        <h1 className="text-3xl font-bold tracking-tight">Welcome{welcomeName}</h1>
      </div>

      {announcements && announcements.length > 0 && (
        <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h2 className="font-semibold mb-3 text-sm text-[var(--color-text-muted)]">Announcements</h2>
          <div className="space-y-2">
            {announcements.map((a) => (
              <div key={a.id} className="text-sm bg-[var(--color-bg)] rounded-md p-3 border-l-2 border-[var(--color-accent)]">
                <p>{a.message}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  {new Date(a.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <a
          href="/exercises"
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:bg-[#1d1d1b] hover:border-[var(--color-warn)] hover:-translate-y-0.5 transition-all"
        >
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
          <h2 className="font-semibold">Exercise Library</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Browse exercises by muscle group</p>
        </a>

        <a
          href="/plans"
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:bg-[#1d1d1b] hover:border-[var(--color-accent)] hover:-translate-y-0.5 transition-all"
        >
          <div className="w-9 h-9 rounded-md bg-[var(--color-accent)]/15 flex items-center justify-center mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <h2 className="font-semibold">Workout Plans</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Your plans & AI-generated routines</p>
        </a>

        <a
          href="/progress"
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:bg-[#1d1d1b] hover:border-[var(--color-positive)] hover:-translate-y-0.5 transition-all"
        >
          <div className="w-9 h-9 rounded-md bg-[var(--color-positive)]/15 flex items-center justify-center mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            </svg>
          </div>
          <h2 className="font-semibold">Progress</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Weight, steps & measurements</p>
        </a>

        {member?.role === 'admin' && (
          <a
            href="/admin"
            className="rounded-lg border border-[var(--color-accent)] bg-[var(--color-surface)] p-5 hover:bg-[#1d1d1b] hover:-translate-y-0.5 transition-all"
          >
            <div className="w-9 h-9 rounded-md bg-[var(--color-accent)] flex items-center justify-center mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="font-semibold text-[var(--color-accent)]">Admin Panel</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage gym members</p>
          </a>
        )}
      </div>
    </div>
  )
}
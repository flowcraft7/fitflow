'use server'

import { createClient } from '@/lib/supabase/server'

export async function logProgress(weightKg: number | null, steps: number | null, notes: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.from('progress_logs').insert({
    member_id: user.id,
    weight_kg: weightKg,
    steps: steps,
    notes: notes || null,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
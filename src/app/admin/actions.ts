'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSubscription(
  memberId: string,
  status: 'active' | 'inactive' | 'expired',
  expiresOn: string | null
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('members')
    .update({ subscription_status: status, subscription_expires_on: expiresOn })
    .eq('id', memberId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}
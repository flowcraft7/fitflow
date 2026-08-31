'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function completeSignup(userId: string) {
  const headersList = await headers()
  const subdomain = headersList.get('x-gym-subdomain')

  if (!subdomain) {
    return { error: "No gym context found. Please use your gym's link." }
  }

  const supabase = await createClient()

  const { data: gym, error: gymError } = await supabase
    .from('gyms')
    .select('id')
    .eq('subdomain', subdomain)
    .single()

  if (gymError || !gym) {
    return { error: 'Gym not found for this link.' }
  }

  const { error: memberError } = await supabase
    .from('members')
    .insert({ id: userId, gym_id: gym.id, role: 'member' })

  if (memberError) {
    return { error: memberError.message }
  }

  return { success: true }
}
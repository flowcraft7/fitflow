import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function getCurrentGym() {
  const headersList = await headers()
  const subdomain = headersList.get('x-gym-subdomain')

  if (!subdomain) return null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('gyms')
    .select('*')
    .eq('subdomain', subdomain)
    .single()

  if (error || !data) return null
  return data
}

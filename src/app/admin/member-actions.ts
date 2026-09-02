'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

async function requireAdminGymId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: member } = await supabase
    .from('members')
    .select('role, gym_id')
    .eq('id', user.id)
    .single()

  if (!member || member.role !== 'admin') return null
  return member.gym_id
}

export async function addMemberManually(name: string, email: string, password: string) {
  const gymId = await requireAdminGymId()
  if (!gymId) return { error: 'Not authorized' }

  const admin = createAdminClient()

  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createError || !newUser.user) {
    return { error: createError?.message || 'Failed to create user' }
  }

  const { error: memberError } = await admin.from('members').insert({
    id: newUser.user.id,
    gym_id: gymId,
    full_name: name,
    role: 'member',
  })

  if (memberError) {
    return { error: memberError.message }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function deleteMember(memberId: string) {
  const gymId = await requireAdminGymId()
  if (!gymId) return { error: 'Not authorized' }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(memberId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function postAnnouncement(message: string) {
  const gymId = await requireAdminGymId()
  if (!gymId) return { error: 'Not authorized' }

  const supabase = await createClient()
  const { error } = await supabase.from('announcements').insert({
    gym_id: gymId,
    message,
  })

  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteAnnouncement(id: string) {
  const gymId = await requireAdminGymId()
  if (!gymId) return { error: 'Not authorized' }

  const supabase = await createClient()
  const { error } = await supabase.from('announcements').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  return { success: true }
}

export async function updatePricePerMember(price: number) {
  const gymId = await requireAdminGymId()
  if (!gymId) return { error: 'Not authorized' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('gyms')
    .update({ price_per_member: price })
    .eq('id', gymId)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  return { success: true }
}

export async function assignPlanToMember(
  memberId: string,
  title: string,
  exercises: { exercise_id: string; sets: number; reps: number; day_label: string }[]
) {
  const gymId = await requireAdminGymId()
  if (!gymId) return { error: 'Not authorized' }

  const supabase = await createClient()

  const { data: plan, error: planError } = await supabase
    .from('workout_plans')
    .insert({
      gym_id: gymId,
      member_id: memberId,
      title,
      goal: 'Assigned by trainer',
      ai_generated: false,
    })
    .select()
    .single()

  if (planError || !plan) return { error: planError?.message || 'Failed to create plan' }

  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i]
    await supabase.from('plan_exercises').insert({
      plan_id: plan.id,
      exercise_id: ex.exercise_id,
      sets: ex.sets,
      reps: ex.reps,
      order_index: i,
      day_label: ex.day_label,
    })
  }

  revalidatePath('/admin')
  return { success: true }
}
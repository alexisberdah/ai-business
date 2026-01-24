import { createClient } from '@/lib/supabase/server'

export async function hasActiveSubscription(): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  return !!subscription
}

export async function requireSubscription() {
  const hasSubscription = await hasActiveSubscription()

  if (!hasSubscription) {
    throw new Error('Active subscription required')
  }
}

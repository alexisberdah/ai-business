import { createClient } from '@/lib/supabase/server'

/**
 * Check if current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  // Check user_metadata for is_admin flag
  return user.user_metadata?.is_admin === true
}

/**
 * Require admin access (throws if not admin)
 */
export async function requireAdmin() {
  const admin = await isAdmin()

  if (!admin) {
    throw new Error('Admin access required')
  }
}

/**
 * Get admin-only data using service role client
 */
export async function getAdminData() {
  const { createClient: createServiceClient } = await import('@supabase/supabase-js')

  const supabaseAdmin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  return supabaseAdmin
}

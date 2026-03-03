import { SupabaseClient } from '@supabase/supabase-js'
import type { Profile, ProfileWithRole, UserRole, ProviderProfile } from '@/lib/types/database'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = SupabaseClient<any, any, any>

/**
 * Returns the current user's profile joined with their role-specific sub-profile.
 * Returns null if there is no active session.
 */
export async function getCurrentUserProfile(
  supabase: AnyClient
): Promise<ProfileWithRole | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data } = await supabase
    .from('profiles')
    .select('*, customer_profiles(*), provider_profiles(*)')
    .eq('id', session.user.id)
    .maybeSingle()

  return data as unknown as ProfileWithRole | null
}

/**
 * Fetches profile and throws if there's no session or if the role doesn't match.
 * Use in pages that should be role-gated.
 */
export async function requireRole(
  supabase: AnyClient,
  role: UserRole
): Promise<ProfileWithRole> {
  const profile = await getCurrentUserProfile(supabase)
  if (!profile) throw new Error('UNAUTHENTICATED')
  if ((profile as Profile).role !== role) throw new Error('UNAUTHORIZED')
  return profile
}

/**
 * Returns true if the current provider's kyc_status is 'approved'.
 */
export async function isProviderApproved(supabase: AnyClient): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false

  const { data } = await supabase
    .from('provider_profiles')
    .select('kyc_status')
    .eq('id', session.user.id)
    .maybeSingle()

  return (data as unknown as Pick<ProviderProfile, 'kyc_status'> | null)?.kyc_status === 'approved'
}

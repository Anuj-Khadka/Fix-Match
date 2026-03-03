import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import type { Profile, UserRole } from '@/lib/types/database'

type AuthContextType = {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  completeOnboarding: (extraMeta?: Record<string, unknown>) => void
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  completeOnboarding: () => {},
})

export const useAuth = () => useContext(AuthContext)

/**
 * Build a Profile from a User object.
 *
 * Priority order:
 *  1. `profiles` table row keyed by profiles.id = auth.users.id  (new migration schema)
 *  2. Supabase user_metadata                                       (always available, set on signUp)
 *
 * This means auth works correctly even before the SQL migration has been applied.
 */
async function buildProfile(user: User): Promise<Profile | null> {
  // Try the new migration schema first (profiles.id = auth.users.id)
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  const meta = user.user_metadata ?? {}

  // If we got a row back that has the `role` column, use it
  const row = data as unknown as Record<string, unknown> | null
  if (row && typeof row.role === 'string') {
    return {
      ...(row as unknown as Profile),
      // auth.updateUser({ data: { onboarding_complete: true } }) updates metadata immediately
      // but the DB row lags behind (best-effort update). Treat it as complete if EITHER says so.
      onboarding_complete: row.onboarding_complete === true || meta.onboarding_complete === true,
    }
  }

  // Fall back to user_metadata — populated at signUp via options.data
  const role = meta.role as UserRole | undefined
  if (!role) return null // user predates this system or signed up without metadata

  return {
    id: user.id,
    role,
    full_name: (meta.full_name as string | undefined) ?? user.email ?? '',
    phone: (meta.phone as string | undefined) ?? null,
    avatar_url: null,
    onboarding_complete: meta.onboarding_complete === true,
    created_at: user.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async () => {
    // Re-fetch the latest user (incl. any metadata updates) before rebuilding profile
    const { data: { user: freshUser } } = await supabase.auth.getUser()
    if (!freshUser) return
    setUser(freshUser)
    const p = await buildProfile(freshUser)
    setProfile(p)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        const p = await buildProfile(s.user)
        setProfile(p)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        setSession(s)
        setUser(s?.user ?? null)
        if (s?.user) {
          const p = await buildProfile(s.user)
          setProfile(p)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  // Mark onboarding complete in local state immediately so ProtectedRoute unblocks,
  // then persist to Supabase in the background (fire-and-forget).
  const completeOnboarding = useCallback((extraMeta: Record<string, unknown> = {}) => {
    setProfile((prev) => prev ? { ...prev, onboarding_complete: true } : prev)
    // Best-effort persist — don't await so this never blocks navigation
    supabase.auth.updateUser({ data: { onboarding_complete: true, ...extraMeta } })
      .catch(() => { /* ignore — local state is the source of truth for this session */ })
  }, [])

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut, refreshProfile, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  )
}

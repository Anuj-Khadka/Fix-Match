import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { UserRole } from '@/lib/types/database'

interface ProtectedRouteProps {
  children: ReactNode
  /** Require a specific role. Redirects to the correct dashboard if role mismatches. */
  requiredRole?: UserRole
  /** Set to true for onboarding routes — allows users with onboarding_complete=false through,
   *  and redirects users who have already completed onboarding to their dashboard. */
  requireOnboarding?: boolean
}

function dashboardFor(role: UserRole): string {
  if (role === 'customer') return '/customer'
  if (role === 'provider') return '/provider'
  return '/admin'
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  requireOnboarding = false,
}: ProtectedRouteProps) => {
  const { session, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  // Not logged in → go to login
  if (!session) return <Navigate to="/auth/login" replace />

  // User on onboarding routes
  if (requireOnboarding) {
    // Already done onboarding → redirect to their dashboard
    if (profile?.onboarding_complete && profile.role) {
      return <Navigate to={dashboardFor(profile.role)} replace />
    }
    return <>{children}</>
  }

  // User hasn't finished onboarding → force them through it
  if (profile && !profile.onboarding_complete) {
    return <Navigate to="/onboarding" replace />
  }

  // Wrong role → redirect to their correct dashboard
  if (requiredRole && profile?.role !== requiredRole) {
    if (profile?.role) return <Navigate to={dashboardFor(profile.role)} replace />
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}

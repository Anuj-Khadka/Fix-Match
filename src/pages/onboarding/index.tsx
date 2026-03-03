import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function OnboardingIndex() {
  const { profile, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (!profile) { navigate('/auth/login', { replace: true }); return }
    if (profile.role === 'customer') navigate('/onboarding/customer', { replace: true })
    else if (profile.role === 'provider') navigate('/onboarding/provider', { replace: true })
    else navigate('/admin', { replace: true })
  }, [profile, loading, navigate])

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  )
}

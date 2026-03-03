import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import type { UserRole } from '@/lib/types/database'

type Mode = 'signup' | 'signin'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(mode: Mode, name: string, email: string, password: string): string | null {
  if (mode === 'signup' && !name.trim()) return 'Full name is required.'
  if (!EMAIL_RE.test(email)) return 'Enter a valid email address.'
  if (password.length < 8) return 'Password must be at least 8 characters.'
  return null
}

function dashboardFor(role: string): string {
  if (role === 'customer') return '/customer'
  if (role === 'provider') return '/provider'
  return '/admin'
}

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('signup')
  const [role, setRole] = useState<UserRole>('customer')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setNotice(null)
  }

  async function handleSubmit() {
    const validationError = validate(mode, name, email, password)
    if (validationError) { setError(validationError); return }

    setError(null)
    setNotice(null)
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { role, full_name: name.trim() } },
        })
        if (signupError) { setError(signupError.message); return }

        if (data.session) {
          // Email confirmation is disabled — user is immediately signed in
          navigate('/onboarding')
        } else {
          // Email confirmation is required
          setNotice('Check your email to confirm your account, then sign in.')
          switchMode('signin')
        }
      } else {
        const { data, error: signinError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signinError) {
          if (signinError.message.toLowerCase().includes('invalid')) {
            setError('Incorrect email or password.')
          } else if (signinError.message.toLowerCase().includes('confirm')) {
            setError('Please confirm your email before signing in.')
          } else {
            setError(signinError.message)
          }
          return
        }

        // Route based on user_metadata — no DB query needed
        const meta = data.user.user_metadata ?? {}
        const userRole = meta.role as string | undefined
        const onboardingComplete = meta.onboarding_complete === true

        if (!userRole || !onboardingComplete) {
          navigate('/onboarding')
          return
        }

        navigate(dashboardFor(userRole))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-md">
        {/* Wordmark */}
        <div className="mb-8 text-center">
          <Link to="/" className="text-3xl font-bold text-blue-600">
            FixMatch
          </Link>
          <p className="mt-1 text-sm text-gray-500">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Role toggle — only shown on signup */}
        {mode === 'signup' && (
          <div className="mb-6 flex gap-2 rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setRole('customer')}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                role === 'customer'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              🏠 I need a service
            </button>
            <button
              onClick={() => setRole('provider')}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                role === 'provider'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              🔧 I want to work
            </button>
          </div>
        )}

        {/* Fields */}
        <div className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Notice (e.g. confirm email) */}
        {notice && (
          <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">{notice}</p>
        )}

        {/* Error */}
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>

        {/* Toggle mode */}
        <p className="mt-6 text-center text-sm text-gray-500">
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => switchMode('signin')}
                className="font-medium text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => switchMode('signup')}
                className="font-medium text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

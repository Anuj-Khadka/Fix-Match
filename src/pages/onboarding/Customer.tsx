import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Autocomplete, LoadScript } from '@react-google-maps/api'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { SavedAddress } from '@/lib/types/database'

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
const TOTAL_STEPS = 3

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
        <span>Step {step} of {TOTAL_STEPS}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div
          className="h-1.5 rounded-full bg-blue-600 transition-all"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
    </div>
  )
}

export default function CustomerOnboarding() {
  const { user, profile, completeOnboarding } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1
  const [phone, setPhone] = useState('')

  // Step 2
  const [addressText, setAddressText] = useState('')
  const [addressLat, setAddressLat] = useState<number | null>(null)
  const [addressLng, setAddressLng] = useState<number | null>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  function onPlaceChanged() {
    if (!autocompleteRef.current) return
    const place = autocompleteRef.current.getPlace()
    setAddressText(place.formatted_address ?? '')
    setAddressLat(place.geometry?.location?.lat() ?? null)
    setAddressLng(place.geometry?.location?.lng() ?? null)
  }

  // Step 1 → 2
  function savePhone() {
    if (!phone.trim()) { setError('Phone number is required.'); return }
    setError(null)
    setStep(2)
  }

  // Step 2 → 3
  function confirmAddress() {
    if (!addressText.trim()) { setError('Please enter your home address.'); return }
    setError(null)
    setStep(3)
  }

  // Step 3 → done
  async function finish() {
    if (!user) return
    setLoading(true)
    setError(null)

    try {
      const homeAddress: SavedAddress = {
        label: 'Home',
        address_text: addressText,
        lat: addressLat ?? 0,
        lng: addressLng ?? 0,
      }

      // Update local profile state immediately — unblocks ProtectedRoute right away.
      // auth.updateUser + DB writes happen in the background (fire-and-forget).
      completeOnboarding({ phone: phone.trim() })

      // Best-effort DB persist (non-blocking)
      // @ts-expect-error – table added by migration 001
      supabase.from('customer_profiles').upsert({ id: user.id, saved_addresses: [homeAddress] })
      // @ts-expect-error – column added by migration 001
      supabase.from('profiles').update({ onboarding_complete: true }).eq('id', user.id)

      navigate('/customer')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const firstName = profile?.full_name?.split(' ')[0] ?? user?.email ?? 'there'

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-[420px]">
        <div className="mb-6 text-center">
          <span className="text-2xl font-bold text-blue-600">FixMatch</span>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <ProgressBar step={step} />

          {/* Step 1 — Phone */}
          {step === 1 && (
            <div>
              <h1 className="font-display text-xl font-bold text-gray-900">
                How should your worker contact you?
              </h1>
              <p className="mt-1 text-sm text-gray-500">We'll share this with the professional you book.</p>
              <div className="mt-6">
                <label className="mb-1 block text-sm font-medium text-gray-700">Phone number</label>
                <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500">+1</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && savePhone()}
                    placeholder="(555) 000-0000"
                    className="flex-1 px-3 py-3 text-sm outline-none"
                  />
                </div>
              </div>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              <button
                onClick={savePhone}
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? 'Saving…' : 'Continue'}
              </button>
            </div>
          )}

          {/* Step 2 — Home address */}
          {step === 2 && (
            <div>
              <h1 className="font-display text-xl font-bold text-gray-900">
                Where do you need services?
              </h1>
              <p className="mt-1 text-sm text-gray-500">We'll use this to find nearby professionals.</p>
              <div className="mt-6">
                <label className="mb-1 block text-sm font-medium text-gray-700">Home address</label>
                {MAPS_KEY ? (
                  <LoadScript googleMapsApiKey={MAPS_KEY} libraries={['places']}>
                    <Autocomplete
                      onLoad={(ac) => { autocompleteRef.current = ac }}
                      onPlaceChanged={onPlaceChanged}
                    >
                      <input
                        type="text"
                        placeholder="123 Main St, City, State"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </Autocomplete>
                  </LoadScript>
                ) : (
                  <input
                    type="text"
                    value={addressText}
                    onChange={(e) => setAddressText(e.target.value)}
                    placeholder="123 Main St, City, State"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                )}
              </div>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={confirmAddress}
                  className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — All set */}
          {step === 3 && (
            <div>
              <h1 className="font-display text-xl font-bold text-gray-900">
                You&apos;re ready to go! 🎉
              </h1>
              <p className="mt-1 text-sm text-gray-500">Here&apos;s a summary of your account.</p>

              <div className="mt-6 space-y-3 rounded-xl bg-gray-50 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-900">{profile?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900">+1 {phone}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Home</span>
                  <span className="text-right font-medium text-gray-900">{addressText || '—'}</span>
                </div>
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                onClick={finish}
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? 'Setting up your account…' : `Start using FixMatch, ${firstName}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

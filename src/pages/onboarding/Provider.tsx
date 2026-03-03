import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

const TOTAL_STEPS = 5

const SERVICE_CATEGORIES = [
  { id: 'plumbing', label: 'Plumbing', emoji: '🔧' },
  { id: 'electrical', label: 'Electrical', emoji: '⚡' },
  { id: 'hvac', label: 'HVAC', emoji: '🌡️' },
  { id: 'locksmith', label: 'Locksmith', emoji: '🔐' },
  { id: 'cleaning', label: 'Cleaning', emoji: '🧹' },
  { id: 'moving', label: 'Moving Help', emoji: '📦' },
  { id: 'snow_removal', label: 'Snow Removal', emoji: '❄️' },
  { id: 'tv_mounting', label: 'TV/Mounting', emoji: '🔩' },
  { id: 'carpentry', label: 'Carpentry', emoji: '🪚' },
  { id: 'painting', label: 'Painting', emoji: '🖌️' },
  { id: 'roofing', label: 'Roofing', emoji: '🏠' },
  { id: 'landscaping', label: 'Landscaping', emoji: '🌿' },
  { id: 'pest_control', label: 'Pest Control', emoji: '🐛' },
  { id: 'appliance_repair', label: 'Appliance Repair', emoji: '🫙' },
  { id: 'flooring', label: 'Flooring', emoji: '🪵' },
  { id: 'drywall', label: 'Drywall', emoji: '🧱' },
  { id: 'window_cleaning', label: 'Window Cleaning', emoji: '🪟' },
  { id: 'pressure_washing', label: 'Pressure Washing', emoji: '💦' },
  { id: 'gutter_cleaning', label: 'Gutter Cleaning', emoji: '🍂' },
  { id: 'fence_repair', label: 'Fence & Gate', emoji: '🚧' },
  { id: 'pool_service', label: 'Pool Service', emoji: '🏊' },
  { id: 'solar_installation', label: 'Solar Installation', emoji: '☀️' },
  { id: 'security_systems', label: 'Security Systems', emoji: '📷' },
  { id: 'smart_home', label: 'Smart Home', emoji: '📱' },
  { id: 'garage_door', label: 'Garage Door', emoji: '🚗' },
  { id: 'junk_removal', label: 'Junk Removal', emoji: '🗑️' },
  { id: 'handyman', label: 'Handyman', emoji: '🛠️' },
  { id: 'interior_design', label: 'Interior Design', emoji: '🛋️' },
  { id: 'masonry', label: 'Masonry', emoji: '🧱' },
  { id: 'welding', label: 'Welding', emoji: '🔥' },
]

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

export default function ProviderOnboarding() {
  const { user, profile, completeOnboarding } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1 — About
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')

  // Step 2 — Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [otherSkill, setOtherSkill] = useState('')

  // Step 3 — Rate
  const [hourlyRate, setHourlyRate] = useState('')

  // Step 4 — ID upload
  const [kycDocUrl, setKycDocUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function toggleSkill(id: string) {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  // Step 1 → 2
  function saveAbout() {
    if (!phone.trim()) { setError('Phone number is required.'); return }
    setError(null)
    setStep(2)
  }

  // Step 2 → 3
  function confirmSkills() {
    const hasOther = otherSkill.trim().length > 0
    if (selectedSkills.length === 0 && !hasOther) { setError('Select at least one service.'); return }
    setError(null)
    setStep(3)
  }

  // Step 3 → 4
  function confirmRate() {
    const rate = parseFloat(hourlyRate)
    if (!hourlyRate || isNaN(rate) || rate <= 0) { setError('Enter a valid hourly rate.'); return }
    setError(null)
    setStep(4)
  }

  // Upload document
  async function uploadDocument(file: File) {
    if (!user) return
    setUploading(true)
    setError(null)
    const path = `${user.id}/id-document`
    try {
      const { error: uploadErr } = await supabase.storage
        .from('kyc-documents')
        .upload(path, file, { upsert: true })
      if (uploadErr) {
        setError('Upload failed: ' + uploadErr.message + '. You can skip this step and upload later.')
        return
      }
      setKycDocUrl(path)
    } catch {
      setError('Upload failed. You can skip this step and submit your ID later.')
    } finally {
      setUploading(false)
    }
  }

  // Step 4 → 5
  function confirmDocument() {
    // KYC upload is optional — can be submitted later via dashboard
    setError(null)
    setStep(5)
  }

  // Step 5 — finish
  async function finish() {
    if (!user) return
    setLoading(true)
    setError(null)

    try {
      const allSkills = otherSkill.trim()
        ? [...selectedSkills, otherSkill.trim()]
        : selectedSkills

      // Update local profile state immediately — unblocks ProtectedRoute right away.
      // auth.updateUser + DB writes happen in the background (fire-and-forget).
      completeOnboarding({ phone: phone.trim() })

      // Best-effort DB persist (non-blocking)
      // @ts-expect-error – table added by migration 001
      supabase.from('provider_profiles').upsert({
        id: user.id,
        business_name: businessName.trim() || null,
        bio: bio.trim() || null,
        skills: allSkills,
        hourly_rate: parseFloat(hourlyRate),
        kyc_document_url: kycDocUrl || null,
        kyc_status: 'pending',
      })
      // @ts-expect-error – column added by migration 001
      supabase.from('profiles').update({ onboarding_complete: true }).eq('id', user.id)

      navigate('/provider')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const takeHome = hourlyRate && !isNaN(parseFloat(hourlyRate))
    ? (parseFloat(hourlyRate) * 0.8).toFixed(2)
    : null

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-[460px]">
        <div className="mb-6 text-center">
          <span className="text-2xl font-bold text-blue-600">FixMatch</span>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <ProgressBar step={step} />

          {/* Step 1 — About */}
          {step === 1 && (
            <div>
              <h1 className="font-display text-xl font-bold text-gray-900">Tell us about yourself</h1>
              <p className="mt-1 text-sm text-gray-500">Help customers know who they&apos;re booking.</p>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Business name <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Smith Plumbing LLC"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Phone number</label>
                  <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                    <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500">+1</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="flex-1 px-3 py-3 text-sm outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Short bio <span className="text-gray-400">(max 200 chars)</span>
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 200))}
                    placeholder="10 years of licensed plumbing experience…"
                    rows={3}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <p className="mt-1 text-right text-xs text-gray-400">{bio.length}/200</p>
                </div>
              </div>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              <button
                onClick={saveAbout}
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? 'Saving…' : 'Continue'}
              </button>
            </div>
          )}

          {/* Step 2 — Skills */}
          {step === 2 && (
            <div>
              <h1 className="font-display text-xl font-bold text-gray-900">What services do you offer?</h1>
              <p className="mt-1 text-sm text-gray-500">
                Select everything that applies.{' '}
                {selectedSkills.length > 0 && (
                  <span className="font-medium text-blue-600">{selectedSkills.length} selected</span>
                )}
              </p>
              <div className="mt-4 h-72 overflow-y-auto rounded-xl border border-gray-200 p-3">
                <div className="grid grid-cols-2 gap-2">
                  {SERVICE_CATEGORIES.map(({ id, label, emoji }) => {
                    const selected = selectedSkills.includes(id)
                    return (
                      <button
                        key={id}
                        onClick={() => toggleSkill(id)}
                        className={`flex items-center gap-2 rounded-xl border-2 p-3 text-left text-sm font-medium transition-colors ${
                          selected
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">{emoji}</span>
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Other */}
              <div className="mt-3">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Other <span className="text-gray-400">(not listed above)</span>
                </label>
                <input
                  type="text"
                  value={otherSkill}
                  onChange={(e) => setOtherSkill(e.target.value)}
                  placeholder="e.g. Chimney sweep, Sauna installation…"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={confirmSkills}
                  className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Rate */}
          {step === 3 && (
            <div>
              <h1 className="font-display text-xl font-bold text-gray-900">Set your hourly rate</h1>
              <p className="mt-1 text-sm text-gray-500">You can change this later.</p>
              <div className="mt-6">
                <label className="mb-1 block text-sm font-medium text-gray-700">Your hourly rate</label>
                <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <span className="flex items-center bg-gray-50 px-3 text-sm font-medium text-gray-500">$</span>
                  <input
                    type="number"
                    min="1"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="75"
                    className="flex-1 px-3 py-3 text-sm outline-none"
                  />
                  <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500">/hr</span>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  FixMatch takes a 20% platform fee.
                </p>
                {takeHome && (
                  <div className="mt-3 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    You earn <strong>${takeHome}</strong> per hour after fees
                  </div>
                )}
              </div>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={confirmRate}
                  className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4 — Identity verification */}
          {step === 4 && (
            <div>
              <h1 className="font-display text-xl font-bold text-gray-900">Upload your ID to get verified</h1>
              <p className="mt-1 text-sm text-gray-500">
                Upload now or skip — you can do this later from your dashboard.
              </p>

              <div className="mt-6 space-y-4">
                {/* Government ID */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Government-issued ID <span className="text-gray-400">(optional)</span>
                  </label>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className={`flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 text-sm transition-colors ${
                      kycDocUrl
                        ? 'border-green-400 bg-green-50 text-green-700'
                        : uploading
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-500 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {uploading ? (
                      <>
                        <div className="mb-2 h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                        Uploading…
                      </>
                    ) : kycDocUrl ? (
                      <>✅ Document uploaded</>
                    ) : (
                      <>
                        <span className="mb-1 text-2xl">📄</span>
                        Tap to upload (image or PDF)
                      </>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) uploadDocument(file)
                    }}
                  />
                </div>

                {/* Info box */}
                <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  Your documents are reviewed within 24 hours. You&apos;ll receive an email once approved.
                </div>
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={confirmDocument}
                  className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 5 — Pending */}
          {step === 5 && (
            <div>
              <h1 className="font-display text-xl font-bold text-gray-900">You&apos;re almost there! ⏳</h1>
              <p className="mt-1 text-sm text-gray-500">
                Review your details, then go to your dashboard.
              </p>

              <div className="mt-6 space-y-3 rounded-xl bg-gray-50 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-900">{profile?.full_name}</span>
                </div>
                {businessName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Business</span>
                    <span className="font-medium text-gray-900">{businessName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900">+1 {phone}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Services</span>
                  <span className="text-right font-medium text-gray-900">
                    {[
                      ...selectedSkills.map((id) => SERVICE_CATEGORIES.find((c) => c.id === id)?.label),
                      ...(otherSkill.trim() ? [otherSkill.trim()] : []),
                    ].join(', ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rate</span>
                  <span className="font-medium text-gray-900">${hourlyRate}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">KYC status</span>
                  <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                    Pending review
                  </span>
                </div>
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                onClick={finish}
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? 'Setting up your account…' : 'Go to my dashboard'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import ProviderLayout from '@/components/layouts/ProviderLayout'

export default function ProviderDashboard() {
  const { user } = useAuth()
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [syncError, setSyncError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    async function syncProfile() {
      const meta = user!.user_metadata ?? {}
      const { data, error: selectErr } = await supabase
        .from('providers')
        .select('is_verified')
        .eq('id', user!.id)
        .maybeSingle()

      if (selectErr) {
        setSyncError(selectErr.message)
        setLoadingProfile(false)
        return
      }

      if (data) {
        // Row exists — use it
        setIsVerified(data.is_verified ?? null)
        setLoadingProfile(false)
        return
      }

      // No row yet — create one from user_metadata (handles existing providers too)
      const { error: insertErr } = await supabase.from('providers').upsert({
        id: user!.id,
        name: (meta.full_name as string) || user!.email || '',
        email: user!.email || null,
        phone: (meta.phone as string) || null,
        is_verified: false,
      })

      if (insertErr) {
        setSyncError(`Could not save profile (${insertErr.code}): ${insertErr.message}`)
      } else {
        setIsVerified(false)
      }
      setLoadingProfile(false)
    }

    syncProfile()
  }, [user])

  return (
    <ProviderLayout>
      <div className="px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>

        {/* Sync error (RLS or network issue) */}
        {syncError && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700 font-mono">
            {syncError}
          </div>
        )}

        {/* Approval banners */}
        {!loadingProfile && (
          <>
            {isVerified !== true && (
              <div className="mt-4 rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-4">
                <p className="text-sm font-medium text-yellow-800">
                  ⏳ Your account is under review.
                </p>
                <p className="mt-1 text-sm text-yellow-700">
                  We&apos;ll notify you by email once approved. This usually takes up to 24 hours.
                </p>
              </div>
            )}

            {isVerified === true && (
              <div className="mt-4">
                {/* Online/Offline toggle placeholder */}
                <div className="flex items-center justify-between rounded-xl border bg-white p-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Availability</p>
                    <p className="text-xs text-gray-500">Go online to receive requests</p>
                  </div>
                  <div className="flex h-7 w-14 cursor-pointer items-center rounded-full bg-gray-200 px-1">
                    <div className="h-5 w-5 rounded-full bg-white shadow" />
                  </div>
                </div>

                {/* Earnings summary placeholder */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { label: 'This week', value: '$0' },
                    { label: 'All time', value: '$0' },
                    { label: 'Jobs done', value: '0' },
                    { label: 'Rating', value: '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl border bg-white p-4 text-center">
                      <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
                      <p className="mt-1 text-xs text-gray-400">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ProviderLayout>
  )
}

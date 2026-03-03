import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { ProviderProfile } from '@/lib/types/database'
import ProviderLayout from '@/components/layouts/ProviderLayout'

export default function ProviderDashboard() {
  const { user } = useAuth()
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    if (!user) return
    // @ts-expect-error – new table added by migration 001
    supabase.from('provider_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setProviderProfile(data as unknown as ProviderProfile | null)
        setLoadingProfile(false)
      })
  }, [user])

  const kycStatus = providerProfile?.kyc_status ?? 'pending'

  return (
    <ProviderLayout>
      <div className="px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>

        {/* KYC banners */}
        {!loadingProfile && (
          <>
            {(kycStatus === 'pending' || kycStatus === 'under_review') && (
              <div className="mt-4 rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-4">
                <p className="text-sm font-medium text-yellow-800">
                  ⏳ Your account is under review.
                </p>
                <p className="mt-1 text-sm text-yellow-700">
                  We&apos;ll notify you by email once approved. This usually takes up to 24 hours.
                </p>
              </div>
            )}

            {kycStatus === 'rejected' && (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-4">
                <p className="text-sm font-medium text-red-800">
                  ❌ Your verification was not approved.
                </p>
                {providerProfile?.kyc_rejection_reason && (
                  <p className="mt-1 text-sm text-red-700">
                    Reason: {providerProfile.kyc_rejection_reason}
                  </p>
                )}
                <Link
                  to="/onboarding/provider"
                  className="mt-3 inline-block text-sm font-semibold text-red-700 underline"
                >
                  Re-upload documents →
                </Link>
              </div>
            )}

            {kycStatus === 'approved' && (
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

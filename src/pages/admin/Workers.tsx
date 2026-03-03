import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import AdminLayout from '@/components/layouts/AdminLayout'

type KycStatus = 'pending' | 'under_review' | 'approved' | 'rejected'

type ProviderRow = {
  id: string
  business_name: string | null
  bio: string | null
  skills: string[]
  hourly_rate: number | null
  kyc_status: KycStatus
  kyc_rejection_reason: string | null
  // joined from profiles
  full_name: string | null
  email: string | null
}

const STATUS_STYLES: Record<KycStatus, string> = {
  pending:      'bg-yellow-100 text-yellow-700',
  under_review: 'bg-blue-100 text-blue-700',
  approved:     'bg-green-100 text-green-700',
  rejected:     'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<KycStatus, string> = {
  pending:      'Pending',
  under_review: 'Under Review',
  approved:     'Approved',
  rejected:     'Rejected',
}

export default function AdminWorkers() {
  const [providers, setProviders] = useState<ProviderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<KycStatus | 'all'>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  async function fetchProviders() {
    setLoading(true)
    const { data, error } = await db
      .from('provider_profiles')
      .select('id, business_name, bio, skills, hourly_rate, kyc_status, kyc_rejection_reason')
      .order('created_at', { ascending: false })
    setLoading(false)

    if (error || !data) return

    setProviders(
      (data as Array<Record<string, unknown>>).map((row) => ({
        id: row.id as string,
        business_name: row.business_name as string | null,
        bio: row.bio as string | null,
        skills: (row.skills as string[]) ?? [],
        hourly_rate: row.hourly_rate as number | null,
        kyc_status: (row.kyc_status as KycStatus) ?? 'pending',
        kyc_rejection_reason: row.kyc_rejection_reason as string | null,
        full_name: null,
        email: null,
      }))
    )
  }

  useEffect(() => { fetchProviders() }, [])

  async function approve(id: string) {
    setActionLoading(id)
    await db.from('provider_profiles')
      .update({ kyc_status: 'approved', kyc_rejection_reason: null })
      .eq('id', id)
    setActionLoading(null)
    fetchProviders()
  }

  async function reject(id: string) {
    if (!rejectReason.trim()) return
    setActionLoading(id)
    await db.from('provider_profiles')
      .update({ kyc_status: 'rejected', kyc_rejection_reason: rejectReason.trim() })
      .eq('id', id)
    setActionLoading(null)
    setRejectId(null)
    setRejectReason('')
    fetchProviders()
  }

  const displayed = filter === 'all'
    ? providers
    : providers.filter((p) => p.kyc_status === filter)

  const counts = {
    all:          providers.length,
    pending:      providers.filter((p) => p.kyc_status === 'pending').length,
    under_review: providers.filter((p) => p.kyc_status === 'under_review').length,
    approved:     providers.filter((p) => p.kyc_status === 'approved').length,
    rejected:     providers.filter((p) => p.kyc_status === 'rejected').length,
  }

  return (
    <AdminLayout>
      <div className="px-4 py-8 md:px-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Provider Approvals</h1>
        <p className="mt-1 text-sm text-gray-500">Review and approve service providers.</p>

        {/* Filter tabs */}
        <div className="mt-6 flex gap-2 flex-wrap">
          {(['pending', 'under_review', 'approved', 'rejected', 'all'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABELS[s]}
              <span className="ml-1.5 opacity-70">({counts[s]})</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-sm text-gray-400">
              Loading…
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-sm text-gray-400">
              No providers in this category.
            </div>
          ) : (
            <div className="space-y-4">
              {displayed.map((p) => (
                <div key={p.id} className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">
                          {p.full_name ?? 'Unknown'}
                        </p>
                        {p.business_name && (
                          <span className="text-sm text-gray-500">· {p.business_name}</span>
                        )}
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[p.kyc_status]}`}>
                          {STATUS_LABELS[p.kyc_status]}
                        </span>
                      </div>

                      {p.bio && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{p.bio}</p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {p.hourly_rate && (
                        <p className="mt-2 text-xs text-gray-400">Rate: ${p.hourly_rate}/hr</p>
                      )}

                      {p.kyc_rejection_reason && (
                        <p className="mt-2 text-xs text-red-600">
                          Rejection reason: {p.kyc_rejection_reason}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    {p.kyc_status !== 'approved' && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => approve(p.id)}
                          disabled={actionLoading === p.id}
                          className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionLoading === p.id ? '…' : '✓ Approve'}
                        </button>
                        {p.kyc_status !== 'rejected' && (
                          <button
                            onClick={() => { setRejectId(p.id); setRejectReason('') }}
                            disabled={actionLoading === p.id}
                            className="rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            ✕ Reject
                          </button>
                        )}
                      </div>
                    )}
                    {p.kyc_status === 'approved' && (
                      <button
                        onClick={() => { setRejectId(p.id); setRejectReason('') }}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 shrink-0"
                      >
                        Revoke
                      </button>
                    )}
                  </div>

                  {/* Reject reason input */}
                  {rejectId === p.id && (
                    <div className="mt-4 border-t pt-4">
                      <label className="mb-1 block text-xs font-medium text-gray-700">
                        Reason for rejection (shown to provider)
                      </label>
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="e.g. ID photo was blurry, please re-upload"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                        autoFocus
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => reject(p.id)}
                          disabled={!rejectReason.trim() || actionLoading === p.id}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Confirm Reject
                        </button>
                        <button
                          onClick={() => setRejectId(null)}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-500 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

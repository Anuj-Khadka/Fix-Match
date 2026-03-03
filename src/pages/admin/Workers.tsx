import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import AdminLayout from '@/components/layouts/AdminLayout'

type ProviderRow = {
  id: string
  name: string
  bio: string | null
  email: string | null
  phone: string | null
  hourly_rate_min: number | null
  hourly_rate_max: number | null
  is_verified: boolean | null
}

type Filter = 'all' | 'pending' | 'approved'

export default function AdminWorkers() {
  const [providers, setProviders] = useState<ProviderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  async function fetchProviders() {
    setLoading(true)
    setFetchError(null)
    const { data, error } = await supabase
      .from('providers')
      .select('id, name, bio, email, phone, hourly_rate_min, hourly_rate_max, is_verified')
      .order('created_at', { ascending: false })
    setLoading(false)

    if (error) {
      setFetchError(error.message)
      return
    }
    setProviders((data ?? []) as ProviderRow[])
  }

  useEffect(() => { fetchProviders() }, [])

  async function approve(id: string) {
    setActionLoading(id)
    await supabase.from('providers').update({ is_verified: true }).eq('id', id)
    setActionLoading(null)
    fetchProviders()
  }

  async function revoke(id: string) {
    setActionLoading(id)
    await supabase.from('providers').update({ is_verified: false }).eq('id', id)
    setActionLoading(null)
    fetchProviders()
  }

  const displayed = filter === 'all'
    ? providers
    : filter === 'approved'
    ? providers.filter((p) => p.is_verified === true)
    : providers.filter((p) => p.is_verified !== true)

  const counts = {
    all:      providers.length,
    pending:  providers.filter((p) => p.is_verified !== true).length,
    approved: providers.filter((p) => p.is_verified === true).length,
  }

  return (
    <AdminLayout>
      <div className="px-4 py-8 md:px-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Provider Approvals</h1>
        <p className="mt-1 text-sm text-gray-500">Review and approve service providers.</p>

        {/* Filter tabs */}
        <div className="mt-6 flex gap-2 flex-wrap">
          {(['pending', 'approved', 'all'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'All' : s === 'approved' ? 'Approved' : 'Pending'}
              <span className="ml-1.5 opacity-70">({counts[s]})</span>
            </button>
          ))}
        </div>

        {/* List */}
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-sm text-gray-400">
              Loading…
            </div>
          ) : fetchError ? (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-4 text-sm text-red-700">
              <p className="font-semibold">Database error</p>
              <p className="mt-1 font-mono text-xs">{fetchError}</p>
              <p className="mt-2 text-xs text-red-600">
                This is likely an RLS (Row Level Security) permission issue. You need to add a SELECT policy for admins on the <code>providers</code> table in Supabase.
              </p>
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-sm text-gray-400">
              <p>No providers in this category.</p>
              {providers.length === 0 && filter === 'pending' && (
                <p className="mt-2 max-w-xs text-center text-xs text-gray-400">
                  Providers appear here after completing the onboarding flow. If you registered a test provider before the latest update, please sign up again.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {displayed.map((p) => (
                <div key={p.id} className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{p.name}</p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            p.is_verified
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {p.is_verified ? 'Approved' : 'Pending'}
                        </span>
                      </div>

                      {p.email && (
                        <p className="mt-0.5 text-xs text-gray-400">{p.email}</p>
                      )}

                      {p.bio && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{p.bio}</p>
                      )}

                      {p.hourly_rate_min && (
                        <p className="mt-2 text-xs text-gray-400">
                          Rate: ${p.hourly_rate_min}/hr
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      {p.is_verified !== true ? (
                        <button
                          onClick={() => approve(p.id)}
                          disabled={actionLoading === p.id}
                          className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionLoading === p.id ? '…' : '✓ Approve'}
                        </button>
                      ) : (
                        <button
                          onClick={() => revoke(p.id)}
                          disabled={actionLoading === p.id}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          {actionLoading === p.id ? '…' : 'Revoke'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

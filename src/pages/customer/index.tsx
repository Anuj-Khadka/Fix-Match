import CustomerLayout from '@/components/layouts/CustomerLayout'
import { useAuth } from '@/contexts/AuthContext'

export default function CustomerDashboard() {
  const { profile } = useAuth()
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <CustomerLayout>
      <div className="px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          {greeting}, {firstName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">What do you need help with today?</p>

        {/* Primary CTA */}
        <button className="mt-8 w-full rounded-2xl bg-blue-600 py-5 text-lg font-semibold text-white shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-transform">
          🔧 Fix Now
        </button>

        {/* Recent jobs */}
        <div className="mt-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Recent jobs
          </h2>
          <div className="rounded-2xl border-2 border-dashed border-gray-200 py-12 text-center">
            <p className="text-sm text-gray-400">No jobs yet. Tap Fix Now to get started.</p>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}

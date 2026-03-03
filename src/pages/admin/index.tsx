import AdminLayout from '@/components/layouts/AdminLayout'

const metrics = [
  { label: 'Total Workers', value: '0' },
  { label: 'Pending KYC', value: '0' },
  { label: 'Active Jobs', value: '0' },
  { label: 'Revenue', value: '$0' },
]

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="px-4 py-8 md:px-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Platform overview</p>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {metrics.map(({ label, value }) => (
            <div key={label} className="rounded-2xl border bg-white p-6">
              <p className="font-display text-3xl font-bold text-gray-900">{value}</p>
              <p className="mt-2 text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

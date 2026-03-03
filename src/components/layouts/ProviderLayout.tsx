import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Briefcase, DollarSign, User } from 'lucide-react'

const navItems = [
  { to: '/provider', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/provider/jobs', label: 'Jobs', icon: Briefcase, end: false },
  { to: '/provider/earnings', label: 'Earnings', icon: DollarSign, end: false },
  { to: '/provider/profile', label: 'Profile', icon: User, end: false },
]

export default function ProviderLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-1 pb-20">{children}</main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white">
        <div className="grid grid-cols-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

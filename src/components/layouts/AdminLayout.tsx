import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Briefcase, Settings } from 'lucide-react'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/workers', label: 'Workers', icon: Users, end: false },
  { to: '/admin/jobs', label: 'Jobs', icon: Briefcase, end: false },
  { to: '/admin/settings', label: 'Settings', icon: Settings, end: false },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r bg-white md:flex">
        <div className="border-b px-6 py-5">
          <span className="text-lg font-bold text-blue-600">FixMatch</span>
          <span className="ml-2 rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
            Admin
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <main className="flex-1 pb-20 md:pb-0">{children}</main>

        {/* Mobile bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
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
    </div>
  )
}

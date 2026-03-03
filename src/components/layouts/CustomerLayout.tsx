import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, ClipboardList, User } from 'lucide-react'

const navItems = [
  { to: '/customer', label: 'Home', icon: Home, end: true },
  { to: '/customer/jobs', label: 'My Jobs', icon: ClipboardList, end: false },
  { to: '/customer/profile', label: 'Profile', icon: User, end: false },
]

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-1 pb-20">{children}</main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white">
        <div className="grid grid-cols-3">
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

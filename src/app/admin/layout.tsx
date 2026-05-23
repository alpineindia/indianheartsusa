import Link from 'next/link'
import { verifyAdmin } from '@/lib/dal'
import { logout } from '@/app/actions/auth'
import { LayoutDashboard, Users, DollarSign, FileText, BarChart3, Heart, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/admin/payments', label: 'Payments', icon: DollarSign },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await verifyAdmin()

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: 'var(--maroon)', borderRight: '3px solid var(--gold)' }}>
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
          <Link href="/admin" className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-300" fill="currentColor" />
            <div>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-playfair)' }}>IndianHearts USA</p>
              <p className="text-xs" style={{ color: 'var(--gold-light)' }}>Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-white/10"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
          <Link href="/" className="flex items-center gap-3 px-4 py-2 text-xs text-white/60 hover:text-white">
            ← Back to Site
          </Link>
          <form action={logout}>
            <button type="submit" className="flex items-center gap-3 px-4 py-2 text-xs text-white/60 hover:text-white w-full">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto" style={{ background: '#f8f4ec' }}>
        {children}
      </main>
    </div>
  )
}

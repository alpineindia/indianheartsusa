'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Heart } from 'lucide-react'

type NavbarProps = {
  isLoggedIn?: boolean
  isAdmin?: boolean
}

export default function Navbar({ isLoggedIn, isAdmin }: NavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <header style={{ background: 'var(--maroon)', borderBottom: '3px solid var(--gold)' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Heart className="w-7 h-7 text-red-300" fill="currentColor" />
          <div>
            <span className="text-white text-xl font-bold block leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              Maangalya
            </span>
            <span className="text-xs leading-tight block" style={{ color: 'var(--gold-light)' }}>USA Matrimonial</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-white">
          <Link href="/browse" className="hover:text-yellow-300 transition-colors">Browse Profiles</Link>
          <Link href="/search" className="hover:text-yellow-300 transition-colors">Search</Link>
          <Link href="/success-stories" className="hover:text-yellow-300 transition-colors">Success Stories</Link>
          <Link href="/membership" className="hover:text-yellow-300 transition-colors">Membership</Link>
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="text-sm text-yellow-300 hover:text-white transition-colors">Admin Panel</Link>
              )}
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded text-sm font-medium transition-colors"
                style={{ background: 'var(--gold)', color: 'var(--maroon)' }}
              >
                My Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white text-sm hover:text-yellow-300 transition-colors">Login</Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded text-sm font-semibold transition-colors"
                style={{ background: 'var(--gold)', color: 'var(--maroon)' }}
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: 'var(--maroon-light)', borderTop: '1px solid var(--gold)' }} className="md:hidden px-4 pb-4">
          <nav className="flex flex-col gap-3 pt-4 text-white text-sm">
            <Link href="/browse" onClick={() => setOpen(false)}>Browse Profiles</Link>
            <Link href="/search" onClick={() => setOpen(false)}>Search</Link>
            <Link href="/success-stories" onClick={() => setOpen(false)}>Success Stories</Link>
            <Link href="/membership" onClick={() => setOpen(false)}>Membership</Link>
            {isLoggedIn ? (
              <Link href="/dashboard" onClick={() => setOpen(false)} className="font-semibold" style={{ color: 'var(--gold)' }}>My Dashboard</Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="font-semibold" style={{ color: 'var(--gold)' }}>Register</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

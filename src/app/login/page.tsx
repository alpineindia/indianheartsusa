'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import { Heart } from 'lucide-react'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: 'var(--cream)' }}>
      {/* Card */}
      <div className="w-full max-w-md traditional-card rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="py-8 px-8 text-center" style={{ background: 'var(--maroon)' }}>
          <Link href="/" className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-7 h-7 text-red-300" fill="currentColor" />
            <span className="text-white text-xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>IndianHearts USA</span>
          </Link>
          <p style={{ color: 'var(--gold-light)' }} className="text-sm">Sign in to your account</p>
        </div>

        <div className="p-8">
          {state?.message && (
            <div className="mb-4 p-3 rounded text-sm text-red-700 bg-red-50 border border-red-200">
              {state.message}
            </div>
          )}

          <form action={action} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--border)' }}
                placeholder="you@example.com"
              />
              {state?.errors?.email && <p className="text-xs text-red-600 mt-1">{state.errors.email[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                style={{ borderColor: 'var(--border)' }}
                placeholder="••••••••"
              />
              {state?.errors?.password && <p className="text-xs text-red-600 mt-1">{state.errors.password[0]}</p>}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 rounded-lg font-semibold text-sm disabled:opacity-60 transition-opacity"
              style={{ background: 'var(--maroon)', color: 'white' }}
            >
              {pending ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm space-y-2">
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold" style={{ color: 'var(--maroon)' }}>
                Register Free
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="mt-6 flex items-center gap-3 opacity-40">
        <div style={{ height: 1, width: 60, background: 'var(--gold)' }} />
        <span style={{ color: 'var(--gold)' }}>✦</span>
        <div style={{ height: 1, width: 60, background: 'var(--gold)' }} />
      </div>
    </div>
  )
}

import Link from 'next/link'
import { Check } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

async function getPricing() {
  const tiers = await prisma.tierPricing.findMany({ orderBy: { priceUsd: 'asc' } })
  return tiers
}

const DEFAULT_TIERS = [
  {
    tier: 'FREE',
    label: 'Free',
    priceUsd: 0,
    desc: 'Get started and explore',
    color: '#6b7280',
    features: ['Create profile', 'Browse approved profiles', 'Send 3 messages/day', 'Express interest', 'Basic profile search'],
  },
  {
    tier: 'PREMIUM',
    label: 'Premium',
    priceUsd: 39,
    desc: 'Connect with more matches',
    color: '#6366f1',
    highlighted: true,
    features: ['Everything in Free', '30 contact details/month', '50 messages/day', 'WhatsApp intro relay', '1 profile boost/month', 'Full horoscope matching', 'Priority listing'],
  },
  {
    tier: 'ELITE',
    label: 'Elite',
    priceUsd: 89,
    desc: 'The ultimate experience',
    color: 'var(--gold)',
    features: ['Everything in Premium', 'Unlimited contact details', 'Unlimited messages', 'Featured profile', 'Dedicated matchmaker', '3 profile boosts/month', 'Concierge support'],
  },
]

export default async function MembershipPage() {
  const [session, dbTiers] = await Promise.all([getSession(), getPricing()])

  const tiers = DEFAULT_TIERS.map((d) => {
    const db = dbTiers.find((t) => t.tier === d.tier)
    return db ? { ...d, priceUsd: db.priceUsd, features: db.features.length ? db.features : d.features } : d
  })

  return (
    <>
      <Navbar isLoggedIn={!!session} isAdmin={session?.role === 'ADMIN'} />
      <main className="flex-1" style={{ background: 'var(--background)' }}>
        {/* Header */}
        <div style={{ background: 'var(--maroon)', borderBottom: '3px solid var(--gold)' }} className="py-12 px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--gold-light)' }}>Membership Plans</p>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
            Choose Your Plan
          </h1>
          <p className="mt-3 text-lg max-w-xl mx-auto" style={{ color: '#f5d0a0' }}>
            Find your perfect match faster with our premium features. All plans include admin-verified profiles.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((plan) => (
              <div
                key={plan.tier}
                className={`rounded-2xl overflow-hidden shadow-lg flex flex-col ${plan.highlighted ? 'ring-2 ring-indigo-500' : ''}`}
              >
                {plan.highlighted && (
                  <div className="py-2 text-center text-xs font-bold text-white" style={{ background: '#6366f1' }}>
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8 flex-1 traditional-card">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl" style={{ background: plan.color }}>
                    {plan.tier === 'FREE' ? '○' : plan.tier === 'PREMIUM' ? '◆' : '★'}
                  </div>
                  <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>{plan.label}</h2>
                  <p className="text-sm opacity-60 mb-4">{plan.desc}</p>

                  <div className="mb-6">
                    {plan.priceUsd === 0 ? (
                      <span className="text-4xl font-bold" style={{ color: 'var(--maroon)' }}>Free</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold" style={{ color: 'var(--maroon)' }}>${plan.priceUsd}</span>
                        <span className="text-sm opacity-60">/month</span>
                      </>
                    )}
                  </div>

                  <ul className="space-y-2 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--gold)' }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {plan.priceUsd === 0 ? (
                    <Link
                      href="/register"
                      className="block text-center py-3 rounded-lg font-semibold text-sm"
                      style={{ background: 'var(--cream-dark)', color: 'var(--maroon)', border: '1px solid var(--border)' }}
                    >
                      Get Started Free
                    </Link>
                  ) : (
                    <form action="/api/checkout" method="POST">
                      <input type="hidden" name="tier" value={plan.tier} />
                      <button
                        type="submit"
                        className="w-full py-3 rounded-lg font-semibold text-sm"
                        style={{ background: plan.highlighted ? '#6366f1' : 'var(--maroon)', color: 'white' }}
                      >
                        {session ? `Upgrade to ${plan.label}` : 'Register & Upgrade'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 traditional-card rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
              All Plans Include
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
              {[
                '✅ Admin-verified profiles',
                '✅ Secure encrypted data',
                '✅ Email support',
                '✅ Cancel anytime',
              ].map((f) => (
                <div key={f} className="p-3 rounded-lg" style={{ background: 'var(--cream-dark)' }}>{f}</div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

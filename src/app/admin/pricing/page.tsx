import { prisma } from '@/lib/prisma'
import { updateTierPricing } from '@/app/actions/admin'
import type { MembershipTier } from '@/generated/prisma/client'

async function getPricing() {
  return prisma.tierPricing.findMany({ orderBy: { priceUsd: 'asc' } })
}

const TIERS: { tier: MembershipTier; label: string; defaultPrice: number }[] = [
  { tier: 'FREE', label: 'Free', defaultPrice: 0 },
  { tier: 'PREMIUM', label: 'Premium', defaultPrice: 39 },
  { tier: 'ELITE', label: 'Elite', defaultPrice: 89 },
]

export default async function AdminPricingPage() {
  const pricing = await getPricing()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Membership Pricing</h1>
      <p className="text-sm opacity-60 mb-8">Edit pricing and features for each membership tier. Changes reflect immediately on the membership page.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {TIERS.map(({ tier, label, defaultPrice }) => {
          const current = pricing.find((p) => p.tier === tier)

          return (
            <div key={tier} className="traditional-card rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>{label} Tier</h2>
              <form action={async (fd: FormData) => {
                'use server'
                await updateTierPricing(tier, {
                  priceUsd: parseFloat(fd.get('priceUsd') as string) || 0,
                  contactLimit: parseInt(fd.get('contactLimit') as string) || 0,
                  dailyMessageLimit: parseInt(fd.get('dailyMessageLimit') as string) || 3,
                  profileBoostPerMonth: parseInt(fd.get('profileBoostPerMonth') as string) || 0,
                  features: (fd.get('features') as string).split('\n').map(f => f.trim()).filter(Boolean),
                })
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">Price (USD/month)</label>
                  <input
                    name="priceUsd"
                    type="number"
                    step="0.01"
                    defaultValue={current?.priceUsd ?? defaultPrice}
                    disabled={tier === 'FREE'}
                    className="w-full border rounded px-3 py-2 text-sm disabled:opacity-50"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">Contact Details Limit/month</label>
                  <input name="contactLimit" type="number" defaultValue={current?.contactLimit ?? (tier === 'FREE' ? 0 : tier === 'PREMIUM' ? 30 : 9999)} className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">Daily Message Limit</label>
                  <input name="dailyMessageLimit" type="number" defaultValue={current?.dailyMessageLimit ?? (tier === 'FREE' ? 3 : tier === 'PREMIUM' ? 50 : 9999)} className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">Profile Boosts/month</label>
                  <input name="profileBoostPerMonth" type="number" defaultValue={current?.profileBoostPerMonth ?? (tier === 'FREE' ? 0 : tier === 'PREMIUM' ? 1 : 3)} className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">Features (one per line)</label>
                  <textarea
                    name="features"
                    rows={6}
                    defaultValue={current?.features.join('\n') ?? ''}
                    className="w-full border rounded px-3 py-2 text-sm font-mono"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="Create profile&#10;Browse profiles&#10;3 messages/day"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 rounded font-semibold text-sm text-white" style={{ background: 'var(--maroon)' }}>
                  Save Changes
                </button>
              </form>
            </div>
          )
        })}
      </div>
    </div>
  )
}

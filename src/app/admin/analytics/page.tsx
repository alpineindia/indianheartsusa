import { prisma } from '@/lib/prisma'

async function getAnalytics() {
  const [
    usersByTier, usersByStatus, messagesByDay, recentPayments, topStates,
  ] = await Promise.all([
    prisma.user.groupBy({ by: ['membershipTier'], _count: { id: true } }),
    prisma.user.groupBy({ by: ['status'], _count: { id: true }, where: { role: 'MEMBER' } }),
    prisma.message.groupBy({
      by: ['createdAt'],
      _count: { id: true },
      orderBy: { createdAt: 'desc' },
      take: 7,
    }),
    prisma.payment.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { user: { include: { profile: true } } } }),
    prisma.profile.groupBy({ by: ['state'], _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 10 }),
  ])
  return { usersByTier, usersByStatus, messagesByDay, recentPayments, topStates }
}

export default async function AdminAnalyticsPage() {
  const { usersByTier, usersByStatus, topStates, recentPayments } = await getAnalytics()

  const tierColors: Record<string, string> = { FREE: '#6b7280', PREMIUM: '#6366f1', ELITE: '#c9a84c' }
  const statusColors: Record<string, string> = { APPROVED: '#10b981', PENDING: '#f59e0b', SUSPENDED: '#ef4444', REJECTED: '#6b7280' }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Analytics</h1>
      <p className="text-sm opacity-60 mb-8">Platform insights</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Tier Breakdown */}
        <div className="traditional-card rounded-xl p-6">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--maroon)' }}>Members by Tier</h3>
          <div className="space-y-3">
            {usersByTier.map((g) => (
              <div key={g.membershipTier}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: tierColors[g.membershipTier] }}>{g.membershipTier}</span>
                  <span className="font-semibold">{g._count.id}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--cream-dark)' }}>
                  <div style={{ width: `${Math.min(100, (g._count.id / 100) * 100)}%`, background: tierColors[g.membershipTier] }} className="h-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="traditional-card rounded-xl p-6">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--maroon)' }}>Members by Status</h3>
          <div className="space-y-3">
            {usersByStatus.map((g) => (
              <div key={g.status}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: statusColors[g.status] }}>{g.status}</span>
                  <span className="font-semibold">{g._count.id}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--cream-dark)' }}>
                  <div style={{ width: `${Math.min(100, (g._count.id / 50) * 100)}%`, background: statusColors[g.status] }} className="h-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top States */}
        <div className="traditional-card rounded-xl p-6">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--maroon)' }}>Top States</h3>
          <div className="space-y-2">
            {topStates.map((s) => (
              <div key={s.state} className="flex justify-between text-sm">
                <span className="opacity-70">{s.state}</span>
                <span className="font-semibold">{s._count.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="traditional-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--maroon)' }}>Recent Payments</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--cream-dark)' }}>
              {['Member','Tier','Amount','Date'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold opacity-60 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentPayments.map((p) => (
              <tr key={p.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                <td className="px-5 py-3">{p.user.profile?.firstName} {p.user.profile?.lastName}</td>
                <td className="px-5 py-3 font-medium" style={{ color: tierColors[p.tier] }}>{p.tier}</td>
                <td className="px-5 py-3 font-semibold" style={{ color: '#059669' }}>${p.amountUsd.toFixed(2)}</td>
                <td className="px-5 py-3 opacity-60">{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

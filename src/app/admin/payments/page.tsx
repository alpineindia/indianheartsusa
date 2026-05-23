import { prisma } from '@/lib/prisma'

async function getPayments() {
  return prisma.payment.findMany({
    include: { user: { include: { profile: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}

async function getPaymentStats() {
  const [total, monthly] = await Promise.all([
    prisma.payment.aggregate({ _sum: { amountUsd: true } }),
    prisma.payment.aggregate({
      _sum: { amountUsd: true },
      where: { createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
    }),
  ])
  return { total: total._sum.amountUsd ?? 0, monthly: monthly._sum.amountUsd ?? 0 }
}

export default async function AdminPaymentsPage() {
  const [payments, stats] = await Promise.all([getPayments(), getPaymentStats()])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Payment History</h1>
      <p className="text-sm opacity-60 mb-6">All Stripe transactions</p>

      <div className="grid grid-cols-2 gap-5 mb-8">
        <div className="traditional-card rounded-xl p-5">
          <p className="text-xs opacity-60 mb-1">Total Revenue (All Time)</p>
          <p className="text-3xl font-bold" style={{ color: 'var(--maroon)', fontFamily: 'var(--font-playfair)' }}>${stats.total.toFixed(2)}</p>
        </div>
        <div className="traditional-card rounded-xl p-5">
          <p className="text-xs opacity-60 mb-1">This Month</p>
          <p className="text-3xl font-bold" style={{ color: '#059669', fontFamily: 'var(--font-playfair)' }}>${stats.monthly.toFixed(2)}</p>
        </div>
      </div>

      <div className="traditional-card rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--cream-dark)' }}>
              {['Member','Email','Amount','Tier','Status','Date'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold opacity-60 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                <td className="px-5 py-3 font-medium">{p.user.profile?.firstName} {p.user.profile?.lastName}</td>
                <td className="px-5 py-3 opacity-60">{p.user.email}</td>
                <td className="px-5 py-3 font-semibold" style={{ color: '#059669' }}>${p.amountUsd.toFixed(2)}</td>
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: p.tier === 'ELITE' ? '#fef3c7' : '#ede9fe', color: p.tier === 'ELITE' ? '#92400e' : '#5b21b6' }}>
                    {p.tier}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#d1fae5', color: '#065f46' }}>{p.status}</span>
                </td>
                <td className="px-5 py-3 opacity-60">{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center opacity-50">No payments yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

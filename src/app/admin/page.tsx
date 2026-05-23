import { prisma } from '@/lib/prisma'
import { Users, Heart, DollarSign, MessageCircle, Clock, CheckCircle } from 'lucide-react'

async function getAdminStats() {
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
  const [
    totalMembers, pendingMembers, approvedMembers,
    newToday, paymentsThisMonth, totalMessages,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'MEMBER' } }),
    prisma.user.count({ where: { status: 'PENDING' } }),
    prisma.user.count({ where: { status: 'APPROVED' } }),
    prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.payment.aggregate({ _sum: { amountUsd: true }, where: { createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }),
    prisma.message.count(),
  ])
  return { totalMembers, pendingMembers, approvedMembers, newToday, paymentsThisMonth: paymentsThisMonth._sum.amountUsd ?? 0, totalMessages }
}

async function getRecentRegistrations() {
  return prisma.user.findMany({
    where: { role: 'MEMBER' },
    include: { profile: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })
}

export default async function AdminDashboardPage() {
  const [stats, recent] = await Promise.all([getAdminStats(), getRecentRegistrations()])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Admin Dashboard</h1>
      <p className="text-sm opacity-60 mb-8">Overview of your matrimonial platform</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {[
          { icon: <Users className="w-5 h-5" />, label: 'Total Members', value: stats.totalMembers, color: 'var(--maroon)' },
          { icon: <Clock className="w-5 h-5" />, label: 'Pending Approval', value: stats.pendingMembers, color: '#f59e0b', href: '/admin/members?status=PENDING' },
          { icon: <CheckCircle className="w-5 h-5" />, label: 'Approved Members', value: stats.approvedMembers, color: '#10b981' },
          { icon: <Heart className="w-5 h-5" />, label: 'New Today', value: stats.newToday, color: '#6366f1' },
          { icon: <DollarSign className="w-5 h-5" />, label: 'Revenue This Month', value: `$${stats.paymentsThisMonth.toFixed(2)}`, color: '#059669' },
          { icon: <MessageCircle className="w-5 h-5" />, label: 'Total Messages', value: stats.totalMessages, color: 'var(--maroon)' },
        ].map(({ icon, label, value, color, href }) => (
          <div key={label} className="traditional-card rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3" style={{ color }}>{icon}</div>
            <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)', color }}>{value}</div>
            <p className="text-xs opacity-60">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Registrations */}
      <div className="traditional-card rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--maroon)' }}>Recent Registrations</h2>
          <a href="/admin/members" className="text-sm font-medium" style={{ color: 'var(--maroon)' }}>View all →</a>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--cream-dark)' }}>
              <th className="px-6 py-3 text-left text-xs font-semibold opacity-60 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold opacity-60 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold opacity-60 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold opacity-60 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((user) => (
              <tr key={user.id} className="border-t hover:bg-cream/50" style={{ borderColor: 'var(--border)' }}>
                <td className="px-6 py-3 font-medium">{user.profile?.firstName} {user.profile?.lastName}</td>
                <td className="px-6 py-3 opacity-70">{user.email}</td>
                <td className="px-6 py-3">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: user.status === 'APPROVED' ? '#d1fae5' : user.status === 'PENDING' ? '#fef3c7' : '#fee2e2',
                      color: user.status === 'APPROVED' ? '#065f46' : user.status === 'PENDING' ? '#92400e' : '#991b1b',
                    }}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-3 opacity-60">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

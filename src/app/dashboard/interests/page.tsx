import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { respondToInterest } from '@/app/actions/member'
import Link from 'next/link'

export default async function InterestsPage() {
  const session = await verifySession()

  const [received, sent] = await Promise.all([
    prisma.interest.findMany({
      where: { receiverId: session.userId },
      include: {
        sender: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.interest.findMany({
      where: { senderId: session.userId },
      include: {
        receiver: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      PENDING:  { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
      ACCEPTED: { bg: '#d1fae5', color: '#065f46', label: 'Accepted' },
      REJECTED: { bg: '#fee2e2', color: '#991b1b', label: 'Declined' },
    }
    const s = map[status] ?? map.PENDING
    return (
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: s.bg, color: s.color }}>
        {s.label}
      </span>
    )
  }

  return (
    <>
      <Navbar isLoggedIn isAdmin={session.role === 'ADMIN'} />
      <main className="flex-1" style={{ background: 'var(--background)' }}>
        <div style={{ background: 'var(--maroon)', borderBottom: '3px solid var(--gold)' }} className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Interests</h1>
            <p className="text-sm mt-1" style={{ color: '#f5d0a0' }}>Manage expressions of interest you&apos;ve sent and received</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
          {/* Received */}
          <section>
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
              Received ({received.length})
            </h2>
            {received.length === 0 ? (
              <div className="traditional-card rounded-xl p-8 text-center opacity-50 text-sm">No interests received yet</div>
            ) : (
              <div className="space-y-4">
                {received.map((interest) => {
                  const p = interest.sender.profile
                  return (
                    <div key={interest.id} className="traditional-card rounded-xl p-5 flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'var(--cream-dark)' }}>
                        {p?.gender === 'FEMALE' ? '👩' : '👨'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold">{p?.firstName} {p?.lastName}</p>
                          {statusBadge(interest.status)}
                        </div>
                        <p className="text-xs opacity-60 mt-0.5">{p?.city}, {p?.state} · {p?.occupation ?? 'Not specified'}</p>
                        {interest.message && (
                          <p className="text-xs opacity-70 mt-1 italic">&ldquo;{interest.message}&rdquo;</p>
                        )}
                        <p className="text-xs opacity-40 mt-1">{new Date(interest.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Link href={`/profile/${interest.senderId}`} className="px-3 py-1.5 rounded text-xs border" style={{ borderColor: 'var(--gold)', color: 'var(--maroon)' }}>
                          View Profile
                        </Link>
                        {interest.status === 'PENDING' && (
                          <>
                            <form action={async () => { 'use server'; await respondToInterest(interest.id, true) }}>
                              <button type="submit" className="px-3 py-1.5 rounded text-xs text-white bg-green-600">Accept</button>
                            </form>
                            <form action={async () => { 'use server'; await respondToInterest(interest.id, false) }}>
                              <button type="submit" className="px-3 py-1.5 rounded text-xs text-white bg-red-500">Decline</button>
                            </form>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Sent */}
          <section>
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
              Sent ({sent.length})
            </h2>
            {sent.length === 0 ? (
              <div className="traditional-card rounded-xl p-8 text-center opacity-50 text-sm">You haven&apos;t sent any interests yet. <Link href="/browse" className="underline" style={{ color: 'var(--maroon)' }}>Browse profiles</Link></div>
            ) : (
              <div className="space-y-4">
                {sent.map((interest) => {
                  const p = interest.receiver.profile
                  return (
                    <div key={interest.id} className="traditional-card rounded-xl p-5 flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'var(--cream-dark)' }}>
                        {p?.gender === 'FEMALE' ? '👩' : '👨'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold">{p?.firstName} {p?.lastName}</p>
                          {statusBadge(interest.status)}
                        </div>
                        <p className="text-xs opacity-60 mt-0.5">{p?.city}, {p?.state} · {p?.occupation ?? 'Not specified'}</p>
                        {interest.message && (
                          <p className="text-xs opacity-70 mt-1 italic">&ldquo;{interest.message}&rdquo;</p>
                        )}
                        <p className="text-xs opacity-40 mt-1">{new Date(interest.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Link href={`/profile/${interest.receiverId}`} className="px-3 py-1.5 rounded text-xs border flex-shrink-0" style={{ borderColor: 'var(--gold)', color: 'var(--maroon)' }}>
                        View Profile
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { getAge } from '@/lib/utils'

async function getAnalytics(userId: string) {
  const profile = await prisma.profile.findFirst({
    where: { userId },
  })

  if (!profile) return null

  // Get total profile views
  const totalViews = profile.profileViews

  // Get recent viewers (last 10)
  const recentViewers = await prisma.profileView.findMany({
    where: { profileId: profile.id },
    include: { viewer: { include: { profile: true } } },
    orderBy: { viewedAt: 'desc' },
    take: 10,
  })

  // Get view counts for last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const viewsLast7Days = await prisma.profileView.count({
    where: {
      profileId: profile.id,
      viewedAt: { gte: sevenDaysAgo },
    },
  })

  // Get view counts by city (top 5)
  const viewsByCity = await prisma.profileView.groupBy({
    by: ['viewerId'],
    where: { profileId: profile.id },
    _count: true,
    orderBy: { _count: { viewerId: 'desc' } },
    take: 5,
  })

  // Get viewer profiles with city info
  const viewerCityInfo = await Promise.all(
    viewsByCity.map(async (view) => {
      const viewer = await prisma.user.findUnique({
        where: { id: view.viewerId },
        include: { profile: true },
      })
      return { profile: viewer?.profile, count: view._count }
    })
  )

  return { profile, totalViews, recentViewers, viewsLast7Days, viewersByCity: viewerCityInfo.filter(v => v.profile) }
}

export default async function AnalyticsPage() {
  const session = await verifySession()
  const analytics = await getAnalytics(session.userId)

  if (!analytics) {
    return (
      <>
        <Navbar isLoggedIn isAdmin={session.role === 'ADMIN'} />
        <main className="flex-1 max-w-5xl mx-auto px-4 py-8 text-center opacity-60">
          No analytics available yet.
        </main>
        <Footer />
      </>
    )
  }

  const { profile, totalViews, recentViewers, viewsLast7Days, viewersByCity } = analytics

  return (
    <>
      <Navbar isLoggedIn isAdmin={session.role === 'ADMIN'} />
      <main className="flex-1" style={{ background: 'var(--background)' }}>
        {/* Header */}
        <div style={{ background: 'var(--maroon)', borderBottom: '3px solid var(--gold)' }} className="py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold mb-3" style={{ color: 'var(--gold-light)' }}>
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Profile Analytics</h1>
            <p style={{ color: 'var(--gold-light)' }} className="text-sm mt-1">Track who&apos;s viewing your profile</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Views', value: totalViews, color: 'var(--gold)' },
              { label: 'Views (Last 7 Days)', value: viewsLast7Days, color: 'var(--maroon)' },
              { label: 'Recent Viewers', value: recentViewers.length, color: '#6366f1' },
            ].map(({ label, value, color }) => (
              <div key={label} className="traditional-card rounded-lg p-6 text-center border" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm opacity-60 mb-2">{label}</p>
                <p className="text-4xl font-bold" style={{ color }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Who Viewed Your Profile (Premium/Elite only) */}
          {(session.tier === 'PREMIUM' || session.tier === 'ELITE') && (
            <>
              <div className="traditional-card rounded-lg p-6 mb-6 border" style={{ borderColor: 'var(--border)' }}>
                <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
                  Recent Viewers
                </h2>
                {recentViewers.length === 0 ? (
                  <p className="text-sm opacity-60">No views yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentViewers.map(({ viewer, viewedAt }) => (
                      <div key={viewer.id} className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--maroon)' }}>
                            {viewer.profile?.firstName} {viewer.profile?.lastName?.charAt(0) || ''}., {getAge(viewer.profile?.dob || new Date())}
                          </p>
                          <p className="text-xs opacity-60 mt-0.5">{viewer.profile?.city}, {viewer.profile?.state}</p>
                        </div>
                        <Link
                          href={`/profile/${viewer.profile?.id}`}
                          className="px-3 py-1.5 rounded text-xs font-semibold border"
                          style={{ borderColor: 'var(--maroon)', color: 'var(--maroon)' }}
                        >
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Cities */}
              {viewersByCity.length > 0 && (
                <div className="traditional-card rounded-lg p-6 border" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
                    Top Cities of Viewers
                  </h2>
                  <div className="space-y-2">
                    {viewersByCity.map(({ profile: viewerProfile }, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm pb-2">
                        <span>{viewerProfile?.city}, {viewerProfile?.state}</span>
                        <span className="font-semibold" style={{ color: 'var(--gold)' }}>📍</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Free Tier Message */}
          {session.tier === 'FREE' && (
            <div className="traditional-card rounded-lg p-6 border text-center" style={{ borderColor: 'var(--border)', background: 'var(--cream)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--maroon)' }}>Upgrade to Premium or Elite to see who viewed your profile</p>
              <Link href="/membership" className="inline-block mt-3 px-4 py-2 rounded text-sm font-semibold text-white" style={{ background: 'var(--maroon)' }}>
                Upgrade Now
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

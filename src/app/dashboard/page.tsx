import Link from 'next/link'
import { Heart, MessageCircle, User, Star, Bell, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { getAge, computeProfileCompleteness } from '@/lib/utils'
import { logout } from '@/app/actions/auth'

async function getDashboardData(userId: string) {
  const [user, receivedInterests, sentInterests, unreadMessages, matches] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, subscription: true },
    }),
    prisma.interest.count({ where: { receiverId: userId, status: 'PENDING' } }),
    prisma.interest.count({ where: { senderId: userId } }),
    prisma.message.count({ where: { receiverId: userId, readAt: null } }),
    prisma.profile.findMany({
      where: { user: { status: 'APPROVED' }, userId: { not: userId } },
      take: 4,
      orderBy: { isFeatured: 'desc' },
    }),
  ])
  return { user, receivedInterests, sentInterests, unreadMessages, matches }
}

export default async function DashboardPage() {
  const session = await verifySession()
  const { user, receivedInterests, sentInterests, unreadMessages, matches } = await getDashboardData(session.userId)

  if (!user) return null
  const profile = user.profile
  const tier = user.membershipTier

  return (
    <>
      <Navbar isLoggedIn isAdmin={session.role === 'ADMIN'} />
      <main className="flex-1" style={{ background: 'var(--background)' }}>
        {/* Header */}
        <div style={{ background: 'var(--maroon)', borderBottom: '3px solid var(--gold)' }} className="py-8 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                Welcome back, {profile?.firstName ?? 'Member'}!
              </h1>
              <p style={{ color: 'var(--gold-light)' }} className="text-sm mt-1">
                {tier} Member{profile ? ` · ${profile.city}, ${profile.state}` : ''}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/settings" className="px-4 py-2 rounded text-sm font-medium border text-white" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                Edit Profile
              </Link>
              <form action={logout}>
                <button type="submit" className="px-4 py-2 rounded text-sm font-medium" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Profile Completeness Card */}
          {profile && (() => {
            const completeness = computeProfileCompleteness(profile)
            return (
              <div className="mb-6 traditional-card rounded-lg p-6" style={{ border: '1px solid var(--border)' }}>
                <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--maroon)', fontFamily: 'var(--font-playfair)' }}>
                  Profile Strength: {completeness.percentage}%
                </h3>
                <div className="w-full h-2 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(0,0,0,0.1)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${completeness.percentage}%`,
                      background: `linear-gradient(90deg, var(--gold), var(--maroon))`,
                    }}
                  />
                </div>
                {completeness.missing.length > 0 ? (
                  <div>
                    <p className="text-xs opacity-60 mb-2">Complete these to boost your visibility:</p>
                    <ul className="text-xs space-y-1">
                      {completeness.missing.slice(0, 3).map((field) => (
                        <li key={field} className="flex items-start gap-2">
                          <span className="text-gray-400">→</span>
                          <span>{field}</span>
                        </li>
                      ))}
                      {completeness.missing.length > 3 && (
                        <li className="text-gray-400">+ {completeness.missing.length - 3} more</li>
                      )}
                    </ul>
                    <Link href="/dashboard/settings" className="mt-3 inline-block text-xs font-semibold" style={{ color: 'var(--maroon)' }}>
                      Complete Profile →
                    </Link>
                  </div>
                ) : (
                  <p className="text-xs font-semibold" style={{ color: 'var(--maroon)' }}>✓ Your profile is complete!</p>
                )}
              </div>
            )
          })()}

          {/* Tier banner for FREE users */}
          {tier === 'FREE' && (
            <div className="mb-6 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ background: 'var(--cream)', border: '2px solid var(--gold)' }}>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--maroon)' }}>You&apos;re on the Free plan</p>
                <p className="text-xs opacity-60 mt-0.5">Upgrade to Premium or Elite for unlimited messaging, contact details & featured listing.</p>
              </div>
              <Link href="/membership" className="px-5 py-2 rounded-full text-sm font-semibold flex-shrink-0" style={{ background: 'var(--maroon)', color: 'white' }}>
                Upgrade Now
              </Link>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <Heart className="w-5 h-5" />, label: 'Interests Received', value: receivedInterests, href: '/dashboard/interests' },
              { icon: <Bell className="w-5 h-5" />, label: 'Interests Sent', value: sentInterests, href: '/dashboard/interests' },
              { icon: <MessageCircle className="w-5 h-5" />, label: 'Unread Messages', value: unreadMessages, href: '/dashboard/messages' },
              { icon: <Star className="w-5 h-5" />, label: 'Profile Views', value: profile?.profileViews ?? 0, href: '/dashboard' },
            ].map(({ icon, label, value, href }) => (
              <Link key={label} href={href} className="traditional-card rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--gold)' }}>{icon}</div>
                <div className="text-2xl font-bold" style={{ color: 'var(--maroon)', fontFamily: 'var(--font-playfair)' }}>{value}</div>
                <div className="text-xs opacity-60 mt-0.5">{label}</div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Profile Summary */}
            <div className="traditional-card rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
                <User className="w-5 h-5" /> My Profile
              </h2>
              {profile ? (
                <div className="space-y-2 text-sm">
                  {[
                    ['Name', `${profile.firstName} ${profile.lastName}`],
                    ['Age', `${getAge(profile.dob)} years`],
                    ['Religion', profile.religion],
                    ['City', `${profile.city}, ${profile.state}`],
                    ['Education', profile.education ?? '—'],
                    ['Occupation', profile.occupation ?? '—'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span className="opacity-50">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                  <Link href="/dashboard/settings" className="mt-4 block text-center py-2 rounded border text-sm font-semibold" style={{ borderColor: 'var(--maroon)', color: 'var(--maroon)' }}>
                    Edit Profile
                  </Link>
                </div>
              ) : (
                <p className="text-sm opacity-60">Profile not found.</p>
              )}
            </div>

            {/* Suggested Matches */}
            <div className="lg:col-span-2 traditional-card rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
                Suggested Matches
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matches.map((match) => (
                  <div key={match.id} className="border rounded-lg p-4 flex gap-3 items-start" style={{ borderColor: 'var(--border)' }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'var(--cream-dark)', border: '1px solid var(--gold)' }}>
                      {match.gender === 'FEMALE' ? '👰' : '🤵'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm" style={{ color: 'var(--maroon)' }}>{match.firstName}, {getAge(match.dob)}</p>
                      <p className="text-xs opacity-60">{match.religion} · {match.city}</p>
                      <Link href={`/profile/${match.id}`} className="text-xs font-semibold mt-1 flex items-center gap-1" style={{ color: 'var(--maroon)' }}>
                        View <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/browse" className="mt-4 block text-center text-sm font-semibold" style={{ color: 'var(--maroon)' }}>
                Browse all profiles →
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Messages', href: '/dashboard/messages', icon: '💬' },
              { label: 'Interests', href: '/dashboard/interests', icon: '💌' },
              { label: 'Favorites', href: '/dashboard/favorites', icon: '❤️' },
              { label: 'Analytics', href: '/dashboard/analytics', icon: '📊' },
              { label: 'Browse Profiles', href: '/browse', icon: '🔍' },
            ].map(({ label, href, icon }) => (
              <Link key={label} href={href} className="traditional-card rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{icon}</div>
                <p className="text-sm font-semibold" style={{ color: 'var(--maroon)' }}>{label}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

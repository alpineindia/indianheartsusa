import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { getAge, formatLastActive } from '@/lib/utils'

async function getFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: {
      profile: {
        include: { user: { select: { membershipTier: true, id: true, lastActiveAt: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function FavoritesPage() {
  const session = await verifySession()
  const favorites = await getFavorites(session.userId)

  return (
    <>
      <Navbar isLoggedIn isAdmin={session.role === 'ADMIN'} />
      <main className="flex-1" style={{ background: 'var(--background)' }}>
        {/* Header */}
        <div style={{ background: 'var(--maroon)', borderBottom: '3px solid var(--gold)' }} className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>My Favorites</h1>
            <p style={{ color: 'var(--gold-light)' }} className="text-sm mt-1">
              {favorites.length} saved profile{favorites.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium opacity-60 mb-4">No saved profiles yet</p>
              <Link href="/browse" className="px-5 py-2 rounded-lg font-semibold text-sm text-white inline-block" style={{ background: 'var(--maroon)' }}>
                Browse Profiles
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(({ profile }) => {
                const tier = profile.user.membershipTier
                return (
                  <div key={profile.id} className="traditional-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {/* Photo */}
                    <div className="h-48 flex items-center justify-center relative" style={{ background: 'var(--cream-dark)' }}>
                      {profile.photoUrls[0] ? (
                        <img src={profile.photoUrls[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-5xl">{profile.gender === 'FEMALE' ? '👰' : '🤵'}</div>
                      )}
                      {tier !== 'FREE' && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold" style={{ background: tier === 'ELITE' ? 'var(--gold)' : '#6366f1', color: tier === 'ELITE' ? 'var(--maroon)' : 'white' }}>
                          {tier === 'ELITE' ? '★ Elite' : '◆ Premium'}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
                            {profile.firstName}, {getAge(profile.dob)}
                          </h3>
                          <p className="text-xs opacity-60 mt-0.5">ID: {profile.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <Heart className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--maroon)', fill: 'var(--maroon)' }} />
                      </div>
                      <div className="mt-2 space-y-0.5 text-sm opacity-70">
                        <p>{profile.religion}{profile.caste ? ` · ${profile.caste}` : ''}</p>
                        <p>{profile.city}, {profile.state}</p>
                        {profile.education && <p>{profile.education}</p>}
                        {profile.occupation && <p>{profile.occupation}</p>}
                        <p className="text-xs mt-1" style={{ color: 'var(--gold)' }}>🟢 {formatLastActive(profile.user.lastActiveAt)}</p>
                      </div>
                      {profile.aboutMe && <p className="mt-2 text-xs opacity-60 line-clamp-2">{profile.aboutMe}</p>}
                      <Link
                        href={`/profile/${profile.id}`}
                        className="mt-3 flex items-center gap-1 text-sm font-semibold"
                        style={{ color: 'var(--maroon)' }}
                      >
                        View Profile <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

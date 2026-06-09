import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Lock, MessageCircle, Heart } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { getAge, maskPhone, formatLastActive } from '@/lib/utils'
import FavoriteButton from '@/components/profile/FavoriteButton'
import BlockReportButtons from '@/components/profile/BlockReportButtons'

async function getProfile(id: string, userId?: string) {
  return prisma.profile.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, status: true, membershipTier: true, phone: true, whatsapp: true, lastActiveAt: true } },
      favoritedBy: userId ? { where: { userId }, select: { id: true } } : undefined,
    },
  })
}

export default async function ProfilePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ interest?: string }> }) {
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const session = await getSession()
  const profile = await getProfile(id, session?.userId)
  const interestStatus = sp.interest

  if (!profile || profile.user.status !== 'APPROVED') notFound()

  // Record profile view if viewer is different from profile owner
  if (session && session.userId !== profile.user.id) {
    await Promise.all([
      prisma.profileView.create({
        data: { viewerId: session.userId, profileId: id },
      }).catch(() => {}),
      prisma.profile.update({
        where: { id },
        data: { profileViews: { increment: 1 } },
      }).catch(() => {}),
    ])
  }

  const canViewContact = session && (session.tier === 'PREMIUM' || session.tier === 'ELITE')
  const isLoggedIn = !!session

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} isAdmin={session?.role === 'ADMIN'} />
      <main className="flex-1" style={{ background: 'var(--background)' }}>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Photo & Quick Info */}
            <div className="space-y-4">
              <div className="traditional-card rounded-xl overflow-hidden shadow-md">
                <div className="h-72 flex items-center justify-center" style={{ background: 'var(--cream-dark)' }}>
                  {profile.photoUrls[0] ? (
                    <img src={profile.photoUrls[0]} alt={profile.firstName} className="w-full h-full object-cover" style={!isLoggedIn ? { filter: 'blur(10px)' } : {}} />
                  ) : (
                    <div className="text-7xl">{profile.gender === 'FEMALE' ? '👰' : '🤵'}</div>
                  )}
                </div>
                <div className="p-4 text-center">
                  <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
                    {profile.firstName} {isLoggedIn ? profile.lastName : profile.lastName[0] + '.'}
                  </h1>
                  <p className="text-sm opacity-60 mt-1">Profile ID: {id.slice(0, 8).toUpperCase()}</p>
                  {profile.user.membershipTier !== 'FREE' && (
                    <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'var(--gold)', color: 'var(--maroon)' }}>
                      {profile.user.membershipTier === 'ELITE' ? '★ Elite Member' : '◆ Premium Member'}
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Card */}
              <div className="traditional-card rounded-xl p-5">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--maroon)' }}>Contact Details</h3>
                {!isLoggedIn ? (
                  <div className="text-center py-4">
                    <Lock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm opacity-60 mb-3">Login to view contact details</p>
                    <Link href="/login" className="px-4 py-2 rounded text-sm font-semibold text-white" style={{ background: 'var(--maroon)' }}>Login</Link>
                  </div>
                ) : !canViewContact ? (
                  <div className="text-center py-4">
                    <Lock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm opacity-60 mb-3">Upgrade to Premium to view contact details</p>
                    <Link href="/membership" className="px-4 py-2 rounded text-sm font-semibold text-white" style={{ background: 'var(--maroon)' }}>Upgrade Now</Link>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    {profile.user.phone && <p>📞 {profile.user.phone}</p>}
                    {profile.user.whatsapp && <p>💬 WhatsApp: {profile.user.whatsapp}</p>}
                  </div>
                )}
              </div>

              {/* Actions */}
              {isLoggedIn && session.userId !== profile.user.id && (
                <div className="space-y-2">
                  {interestStatus === 'sent' && (
                    <div className="p-3 rounded-lg text-sm text-center font-medium" style={{ background: '#dcfce7', color: '#166534' }}>
                      ✓ Interest sent successfully!
                    </div>
                  )}
                  {interestStatus === 'already_sent' && (
                    <div className="p-3 rounded-lg text-sm text-center font-medium" style={{ background: '#fef9c3', color: '#854d0e' }}>
                      You already sent interest to this profile.
                    </div>
                  )}
                  {!interestStatus && (
                    <form action="/api/interests" method="POST">
                      <input type="hidden" name="receiverId" value={profile.user.id} />
                      <button type="submit" className="w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 text-white" style={{ background: 'var(--maroon)' }}>
                        <Heart className="w-4 h-4" /> Send Interest
                      </button>
                    </form>
                  )}
                  <Link href={`/dashboard/messages?to=${profile.user.id}`} className="w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border" style={{ borderColor: 'var(--maroon)', color: 'var(--maroon)' }}>
                    <MessageCircle className="w-4 h-4" /> Send Message
                  </Link>
                  <FavoriteButton profileId={profile.id} isFavorited={(profile.favoritedBy?.length ?? 0) > 0} />
                  <BlockReportButtons profileId={profile.id} />
                </div>
              )}
            </div>

            {/* Right: Full Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="traditional-card rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
                  Basic Information
                </h2>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  {[
                    ['Age', `${getAge(profile.dob)} years`],
                    ['Gender', profile.gender === 'MALE' ? 'Male (Groom)' : 'Female (Bride)'],
                    ['Marital Status', profile.maritalStatus],
                    ['Height', profile.height ?? '—'],
                    ['Religion', profile.religion],
                    ['Caste', profile.caste ?? '—'],
                    ['Mother Tongue', profile.motherTongue ?? '—'],
                    ['City', profile.city],
                    ['State', profile.state],
                    ['Country', profile.country],
                    ['Last Active', formatLastActive(profile.user.lastActiveAt)],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span className="opacity-50 text-xs block">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Info */}
              <div className="traditional-card rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
                  Professional Details
                </h2>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  {[
                    ['Education', profile.education ?? '—'],
                    ['Occupation', profile.occupation ?? '—'],
                    ['Annual Income', profile.annualIncome ?? '—'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span className="opacity-50 text-xs block">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Family Info */}
              {(profile.familyType || profile.familyStatus) && (
                <div className="traditional-card rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
                    Family Background
                  </h2>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    {[
                      ['Family Type', profile.familyType ?? '—'],
                      ['Family Status', profile.familyStatus ?? '—'],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <span className="opacity-50 text-xs block">{label}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* About Me */}
              {profile.aboutMe && (
                <div className="traditional-card rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>About Me</h2>
                  <p className="text-sm leading-relaxed opacity-80">{profile.aboutMe}</p>
                </div>
              )}

              {/* Horoscope */}
              {profile.horoscopeUrl && isLoggedIn && (
                <div className="traditional-card rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Horoscope</h2>
                  <a href={profile.horoscopeUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 rounded-lg font-semibold text-sm text-white" style={{ background: 'var(--maroon)' }}>
                    📄 View Horoscope
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

import Link from 'next/link'
import { Users, Heart, Star, CheckCircle, ArrowRight, ChevronRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { getAge } from '@/lib/utils'

async function getFeaturedProfiles() {
  return prisma.profile.findMany({
    where: { isFeatured: true, user: { status: 'APPROVED' } },
    take: 6,
    orderBy: { createdAt: 'desc' },
  })
}

async function getStats() {
  const [profiles, stories] = await Promise.all([
    prisma.profile.count({ where: { user: { status: 'APPROVED' } } }),
    prisma.successStory.count({ where: { approved: true } }),
  ])
  return { profiles, stories }
}

async function getRecentStories() {
  return prisma.successStory.findMany({
    where: { approved: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })
}

export default async function HomePage() {
  const [session, featured, stats, stories] = await Promise.all([
    getSession(),
    getFeaturedProfiles(),
    getStats(),
    getRecentStories(),
  ])

  return (
    <>
      <Navbar isLoggedIn={!!session} isAdmin={session?.role === 'ADMIN'} />
      <main className="flex-1">
        {/* Hero Section */}
        <section
          style={{
            background: 'linear-gradient(135deg, var(--maroon) 0%, #4a0010 60%, #1a0005 100%)',
            borderBottom: '4px solid var(--gold)',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="py-20 px-4"
        >
          {/* Decorative SVG pattern */}
          <div className="absolute inset-0 opacity-5" aria-hidden>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="lotus" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <circle cx="40" cy="40" r="20" fill="none" stroke="#c9a84c" strokeWidth="1"/>
                  <circle cx="40" cy="40" r="10" fill="none" stroke="#c9a84c" strokeWidth="0.5"/>
                  <line x1="40" y1="20" x2="40" y2="60" stroke="#c9a84c" strokeWidth="0.5"/>
                  <line x1="20" y1="40" x2="60" y2="40" stroke="#c9a84c" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#lotus)"/>
            </svg>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div style={{ height: 1, background: 'var(--gold)', flex: 1, maxWidth: 100 }} />
              <span style={{ color: 'var(--gold)', fontSize: 24 }}>✦</span>
              <div style={{ height: 1, background: 'var(--gold)', flex: 1, maxWidth: 100 }} />
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Find Your Perfect
              <br />
              <span style={{ color: 'var(--gold-light)' }}>Life Partner in USA</span>
            </h1>

            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#f5d0a0' }}>
              The trusted NRI matrimonial platform for Indian Americans. Join thousands of Indian professionals finding their soulmate.
            </p>

            {/* Search Widget */}
            <div
              style={{ background: 'rgba(255,248,231,0.97)', border: '2px solid var(--gold)', borderRadius: 12 }}
              className="p-6 max-w-2xl mx-auto"
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--maroon)', fontFamily: 'var(--font-playfair)' }}>
                Find Your Match
              </h2>
              <form action="/browse" method="GET" className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <select name="gender" className="border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--gold)', color: 'var(--foreground)' }}>
                  <option value="">I am a...</option>
                  <option value="MALE">Groom</option>
                  <option value="FEMALE">Bride</option>
                </select>
                <select name="religion" className="border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--gold)' }}>
                  <option value="">Religion</option>
                  {['Hindu','Muslim','Christian','Sikh','Jain','Buddhist','Other'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <select name="ageMin" className="border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--gold)' }}>
                  <option value="">Age from</option>
                  {Array.from({length: 30}, (_, i) => i + 21).map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded px-4 py-2 text-sm font-semibold"
                  style={{ background: 'var(--maroon)', color: 'white' }}
                >
                  Search
                </button>
              </form>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
              <Link
                href="/register"
                className="px-8 py-3 rounded-full font-semibold text-sm"
                style={{ background: 'var(--gold)', color: 'var(--maroon)' }}
              >
                Register Free
              </Link>
              <Link
                href="/browse"
                className="px-8 py-3 rounded-full font-semibold text-sm border"
                style={{ borderColor: 'var(--gold)', color: 'var(--gold-light)' }}
              >
                Browse Profiles
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Counters */}
        <section style={{ background: 'var(--cream-dark)', borderBottom: '1px solid var(--border)' }} className="py-8">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Users className="w-8 h-8 mx-auto" />, value: `${stats.profiles.toLocaleString()}+`, label: 'Active Profiles' },
              { icon: <Heart className="w-8 h-8 mx-auto" fill="currentColor" />, value: `${stats.stories}+`, label: 'Success Marriages' },
              { icon: <Star className="w-8 h-8 mx-auto" fill="currentColor" />, value: '5+', label: 'Years Trusted' },
              { icon: <CheckCircle className="w-8 h-8 mx-auto" />, value: '100%', label: 'Admin Verified' },
            ].map(({ icon, value, label }) => (
              <div key={label}>
                <div style={{ color: 'var(--gold)' }}>{icon}</div>
                <div className="text-2xl font-bold mt-1" style={{ color: 'var(--maroon)', fontFamily: 'var(--font-playfair)' }}>{value}</div>
                <div className="text-sm opacity-70">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Profiles */}
        {featured.length > 0 && (
          <section className="py-12 px-4" style={{ background: 'var(--background)' }}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--gold)' }}>Elite Members</p>
                <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Featured Profiles</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map((profile) => (
                  <div key={profile.id} className="traditional-card rounded-lg overflow-hidden shadow-md">
                    <div className="h-48 flex items-center justify-center relative" style={{ background: 'var(--cream-dark)' }}>
                      {profile.photoUrls[0] ? (
                        <img src={profile.photoUrls[0]} alt={profile.firstName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl" style={{ background: 'var(--cream)', border: '2px solid var(--gold)' }}>
                          {profile.gender === 'FEMALE' ? '👰' : '🤵'}
                        </div>
                      )}
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-semibold" style={{ background: 'var(--gold)', color: 'var(--maroon)' }}>★ Elite</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
                        {profile.firstName}, {getAge(profile.dob)}
                      </h3>
                      <p className="text-sm opacity-70">{profile.religion}{profile.caste ? ` · ${profile.caste}` : ''}</p>
                      <p className="text-sm opacity-70">{profile.city}, {profile.state}</p>
                      <Link href={`/profile/${profile.id}`} className="mt-3 flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--maroon)' }}>
                        View Profile <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link href="/browse" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white" style={{ background: 'var(--maroon)' }}>
                  View All Profiles <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }} className="py-12 px-4">
          <div className="max-w-5xl mx-auto text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--gold)' }}>Simple Process</p>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>How It Works</h2>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Register & Create Profile', desc: 'Fill in your details, upload photos, and submit for admin review. Approval usually within 24 hours.' },
              { step: '02', title: 'Browse & Connect', desc: 'Search profiles by religion, caste, location, profession. Send interests and messages to compatible matches.' },
              { step: '03', title: 'Find Your Match', desc: 'Connect via in-app messages, email, or WhatsApp. Upgrade for unlimited access and featured listing.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold" style={{ background: 'var(--maroon)', color: 'var(--gold)' }}>
                  {step}
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>{title}</h3>
                <p className="text-sm opacity-70">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        {stories.length > 0 && (
          <section className="py-12 px-4" style={{ background: 'var(--background)' }}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--gold)' }}>Happy Couples</p>
                <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Success Stories</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <div key={story.id} className="traditional-card rounded-lg p-6">
                    <div className="text-3xl mb-3">💒</div>
                    <h3 className="font-semibold mb-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>{story.coupleNames}</h3>
                    <p className="text-sm opacity-70 line-clamp-4">{story.story}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <Link href="/success-stories" className="text-sm font-semibold" style={{ color: 'var(--maroon)' }}>
                  Read all success stories →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section style={{ background: 'var(--maroon)', borderTop: '4px solid var(--gold)' }} className="py-16 px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
            Ready to Find Your Life Partner?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#f5d0a0' }}>
            Join thousands of Indian Americans finding their perfect match on IndianHearts USA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-3 rounded-full font-semibold" style={{ background: 'var(--gold)', color: 'var(--maroon)' }}>
              Register for Free
            </Link>
            <Link href="/membership" className="px-8 py-3 rounded-full font-semibold border" style={{ borderColor: 'var(--gold)', color: 'var(--gold-light)' }}>
              View Membership Plans
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

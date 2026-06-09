import Link from 'next/link'
import { Search, SlidersHorizontal, ChevronRight, Lock } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { getAge, formatLastActive } from '@/lib/utils'

const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Other']
const US_STATES = ['California', 'Texas', 'New York', 'New Jersey', 'Illinois', 'Georgia', 'Florida', 'Washington', 'Virginia', 'Maryland']

type SearchParams = {
  gender?: string
  religion?: string
  ageMin?: string
  ageMax?: string
  state?: string
  city?: string
  maritalStatus?: string
  page?: string
}

async function getProfiles(params: SearchParams, userId?: string) {
  const page = Math.max(1, parseInt(params.page ?? '1'))
  const pageSize = 12
  const skip = (page - 1) * pageSize

  // Get list of blocked user IDs
  const blockedUsers = userId ? await prisma.block.findMany({
    where: { blockerId: userId },
    select: { blockedId: true },
  }) : []
  const blockedIds = blockedUsers.map(b => b.blockedId)

  const where: Record<string, unknown> = {
    user: { status: 'APPROVED' },
    userId: { notIn: blockedIds },
  }

  if (params.gender) where.gender = params.gender
  if (params.religion) where.religion = params.religion
  if (params.state) where.state = params.state
  if (params.city) where.city = { contains: params.city, mode: 'insensitive' }
  if (params.maritalStatus) where.maritalStatus = params.maritalStatus

  if (params.ageMin || params.ageMax) {
    const now = new Date()
    const dobFilter: Record<string, Date> = {}
    if (params.ageMax) {
      dobFilter.gte = new Date(now.getFullYear() - parseInt(params.ageMax), now.getMonth(), now.getDate())
    }
    if (params.ageMin) {
      dobFilter.lte = new Date(now.getFullYear() - parseInt(params.ageMin), now.getMonth(), now.getDate())
    }
    where.dob = dobFilter
  }

  const [profiles, total] = await Promise.all([
    prisma.profile.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      include: { user: { select: { membershipTier: true, id: true, lastActiveAt: true } } },
    }),
    prisma.profile.count({ where }),
  ])

  return { profiles, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export default async function BrowsePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const session = await getSession()
  const { profiles, total, page, totalPages } = await getProfiles(params, session?.userId)

  return (
    <>
      <Navbar isLoggedIn={!!session} isAdmin={session?.role === 'ADMIN'} />
      <main className="flex-1" style={{ background: 'var(--background)' }}>
        {/* Page header */}
        <div style={{ background: 'var(--maroon)', borderBottom: '3px solid var(--gold)' }} className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Browse Profiles</h1>
            <p style={{ color: 'var(--gold-light)' }} className="text-sm mt-1">{total.toLocaleString()} approved profiles available</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="traditional-card rounded-lg p-5 sticky top-4">
              <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--maroon)' }}>
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </h2>
              <form method="GET" className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1 opacity-70">Looking for</label>
                  <select name="gender" defaultValue={params.gender} className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Any</option>
                    <option value="MALE">Groom</option>
                    <option value="FEMALE">Bride</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 opacity-70">Religion</label>
                  <select name="religion" defaultValue={params.religion} className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Any</option>
                    {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 opacity-70">Age Range</label>
                  <div className="flex gap-2">
                    <input name="ageMin" type="number" defaultValue={params.ageMin} min={18} max={80} placeholder="Min" className="w-full border rounded px-2 py-2 text-sm" style={{ borderColor: 'var(--border)' }} />
                    <input name="ageMax" type="number" defaultValue={params.ageMax} min={18} max={80} placeholder="Max" className="w-full border rounded px-2 py-2 text-sm" style={{ borderColor: 'var(--border)' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 opacity-70">State</label>
                  <select name="state" defaultValue={params.state} className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Any</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 opacity-70">City</label>
                  <input name="city" defaultValue={params.city} placeholder="e.g. New York" className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }} />
                </div>
                <button type="submit" className="w-full py-2 rounded font-semibold text-sm text-white" style={{ background: 'var(--maroon)' }}>
                  Apply Filters
                </button>
                <Link href="/browse" className="block text-center text-xs opacity-60 hover:opacity-100">Clear all</Link>
              </form>
            </div>
          </aside>

          {/* Profiles Grid */}
          <div className="flex-1 min-w-0">
            {!session && (
              <div className="mb-4 p-4 rounded-lg text-sm flex items-center gap-3" style={{ background: 'var(--cream)', border: '1px solid var(--gold)' }}>
                <Lock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold)' }} />
                <span>
                  <Link href="/login" className="font-semibold" style={{ color: 'var(--maroon)' }}>Sign in</Link> or{' '}
                  <Link href="/register" className="font-semibold" style={{ color: 'var(--maroon)' }}>register free</Link>{' '}
                  to view full profiles and contact details.
                </span>
              </div>
            )}

            {profiles.length === 0 ? (
              <div className="text-center py-16 opacity-50">
                <Search className="w-12 h-12 mx-auto mb-4" />
                <p className="font-medium">No profiles match your filters</p>
                <Link href="/browse" className="text-sm mt-2 inline-block" style={{ color: 'var(--maroon)' }}>Clear filters</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {profiles.map((profile) => {
                  const tier = profile.user.membershipTier
                  return (
                    <div key={profile.id} className="traditional-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {/* Photo */}
                      <div className="h-44 flex items-center justify-center relative" style={{ background: 'var(--cream-dark)' }}>
                        {profile.photoUrls[0] ? (
                          <img
                            src={profile.photoUrls[0]}
                            alt=""
                            className="w-full h-full object-cover"
                            style={!session ? { filter: 'blur(8px)' } : {}}
                          />
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
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
                              {profile.firstName}, {getAge(profile.dob)}
                            </h3>
                            <p className="text-xs opacity-60 mt-0.5">ID: {profile.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="mt-2 space-y-0.5 text-sm opacity-70">
                          <p>{profile.religion}{profile.caste ? ` · ${profile.caste}` : ''}</p>
                          <p>{profile.city}, {profile.state}</p>
                          {profile.education && <p>{profile.education}</p>}
                          {profile.occupation && <p>{profile.occupation}</p>}
                          <p className="text-xs mt-1" style={{ color: 'var(--gold)' }}>🟢 {formatLastActive(profile.user.lastActiveAt)}</p>
                        </div>
                        {profile.aboutMe && (
                          <p className="mt-2 text-xs opacity-60 line-clamp-2">{profile.aboutMe}</p>
                        )}
                        <Link
                          href={session ? `/profile/${profile.id}` : '/login'}
                          className="mt-3 flex items-center gap-1 text-sm font-semibold"
                          style={{ color: 'var(--maroon)' }}
                        >
                          {session ? 'View Profile' : 'Login to View'} <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {page > 1 && (
                  <Link
                    href={`/browse?${new URLSearchParams({ ...params, page: String(page - 1) })}`}
                    className="px-4 py-2 rounded border text-sm"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    Previous
                  </Link>
                )}
                <span className="text-sm opacity-60">Page {page} of {totalPages}</span>
                {page < totalPages && (
                  <Link
                    href={`/browse?${new URLSearchParams({ ...params, page: String(page + 1) })}`}
                    className="px-4 py-2 rounded border text-sm"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

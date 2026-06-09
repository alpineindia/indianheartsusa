import Link from 'next/link'
import { Search, ChevronRight, Lock, SlidersHorizontal } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { getAge, formatLastActive } from '@/lib/utils'

const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Other']
const CASTES = ['Brahmin', 'Kshatriya', 'Vaishya', 'Agarwal', 'Patel', 'Jat', 'Khatri', 'Iyer', 'Iyengar', 'Nair', 'Reddy', 'Kamma', 'Naidu', 'Yadav', 'Shrimal', 'Other']
const MOTHER_TONGUES = ['Hindi', 'Gujarati', 'Punjabi', 'Tamil', 'Telugu', 'Malayalam', 'Marathi', 'Bengali', 'Kannada', 'Odia', 'Urdu', 'Other']
const MARITAL_STATUSES = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce']
const INCOMES = ['Under $50,000', '$50,000 - $100,000', '$100,000 - $120,000', '$120,000 - $150,000', '$150,000 - $200,000', '$200,000 - $250,000', '$250,000+']
const EDUCATIONS = ['High School', 'Some College', 'Bachelor\'s Degree', 'Master\'s Degree', 'M.D. / Medical Doctor', 'J.D. / Law', 'Ph.D.', 'MBA', 'Other']
const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
  'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
  'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
  'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
  'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
]

type SearchParams = {
  gender?: string; religion?: string; caste?: string; motherTongue?: string
  ageMin?: string; ageMax?: string; state?: string; city?: string
  maritalStatus?: string; annualIncome?: string; education?: string; page?: string; sort?: string
}

async function searchProfiles(params: SearchParams) {
  const page = Math.max(1, parseInt(params.page ?? '1'))
  const pageSize = 12
  const skip = (page - 1) * pageSize

  const where: Record<string, unknown> = { user: { status: 'APPROVED' } }

  if (params.gender) where.gender = params.gender
  if (params.religion) where.religion = params.religion
  if (params.caste) where.caste = { contains: params.caste, mode: 'insensitive' }
  if (params.motherTongue) where.motherTongue = { contains: params.motherTongue, mode: 'insensitive' }
  if (params.state) where.state = params.state
  if (params.city) where.city = { contains: params.city, mode: 'insensitive' }
  if (params.maritalStatus) where.maritalStatus = params.maritalStatus
  if (params.annualIncome) where.annualIncome = { contains: params.annualIncome, mode: 'insensitive' }
  if (params.education) where.education = { contains: params.education, mode: 'insensitive' }

  if (params.ageMin || params.ageMax) {
    const now = new Date()
    const dobFilter: Record<string, Date> = {}
    if (params.ageMax) dobFilter.gte = new Date(now.getFullYear() - parseInt(params.ageMax), now.getMonth(), now.getDate())
    if (params.ageMin) dobFilter.lte = new Date(now.getFullYear() - parseInt(params.ageMin), now.getMonth(), now.getDate())
    where.dob = dobFilter
  }

  const [profiles, total] = await Promise.all([
    prisma.profile.findMany({
      where, skip, take: pageSize,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      include: { user: { select: { membershipTier: true, id: true, lastActiveAt: true } } },
    }),
    prisma.profile.count({ where }),
  ])

  return { profiles, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

function hasFilters(params: SearchParams) {
  return Object.entries(params).some(([k, v]) => k !== 'page' && v)
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const session = await getSession()
  const searched = hasFilters(params)
  const { profiles, total, page, totalPages } = searched
    ? await searchProfiles(params)
    : { profiles: [], total: 0, page: 1, totalPages: 0 }

  return (
    <>
      <Navbar isLoggedIn={!!session} isAdmin={session?.role === 'ADMIN'} />
      <main className="flex-1" style={{ background: 'var(--background)' }}>
        {/* Header */}
        <div style={{ background: 'var(--maroon)', borderBottom: '3px solid var(--gold)' }} className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-playfair)' }}>
              <SlidersHorizontal className="w-7 h-7" /> Advanced Search
            </h1>
            <p style={{ color: 'var(--gold-light)' }} className="text-sm mt-1">
              Filter by religion, caste, language, income, education and more
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Filter Panel */}
          <div className="traditional-card rounded-xl p-6 mb-8 shadow-sm">
            <form method="GET" className="space-y-5">
              {/* Row 1 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-70">I am looking for</label>
                  <select name="gender" defaultValue={params.gender} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Any (Bride / Groom)</option>
                    <option value="MALE">Groom</option>
                    <option value="FEMALE">Bride</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-70">Religion</label>
                  <select name="religion" defaultValue={params.religion} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Any Religion</option>
                    {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-70">Caste / Community</label>
                  <select name="caste" defaultValue={params.caste} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Any Caste</option>
                    {CASTES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-70">Mother Tongue</label>
                  <select name="motherTongue" defaultValue={params.motherTongue} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Any Language</option>
                    {MOTHER_TONGUES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-70">Age From</label>
                  <select name="ageMin" defaultValue={params.ageMin} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Min Age</option>
                    {Array.from({ length: 33 }, (_, i) => i + 18).map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-70">Age To</label>
                  <select name="ageMax" defaultValue={params.ageMax} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Max Age</option>
                    {Array.from({ length: 33 }, (_, i) => i + 18).map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-70">Marital Status</label>
                  <select name="maritalStatus" defaultValue={params.maritalStatus} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Any Status</option>
                    {MARITAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-70">State (USA)</label>
                  <select name="state" defaultValue={params.state} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Any State</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-70">Education</label>
                  <select name="education" defaultValue={params.education} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Any Education</option>
                    {EDUCATIONS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-70">Annual Income</label>
                  <select name="annualIncome" defaultValue={params.annualIncome} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Any Income</option>
                    {INCOMES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-70">City</label>
                  <input
                    name="city"
                    defaultValue={params.city}
                    placeholder="e.g. New York"
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <div className="flex items-end gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white flex items-center justify-center gap-2"
                    style={{ background: 'var(--maroon)' }}
                  >
                    <Search className="w-4 h-4" /> Search
                  </button>
                  {searched && (
                    <Link href="/search" className="py-2.5 px-4 rounded-lg border text-sm font-medium" style={{ borderColor: 'var(--border)' }}>
                      Reset
                    </Link>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Results */}
          {!searched ? (
            <div className="text-center py-20 opacity-50">
              <Search className="w-14 h-14 mx-auto mb-4" />
              <p className="text-lg font-medium">Select filters above and click Search</p>
              <p className="text-sm mt-1">Or <Link href="/browse" className="underline" style={{ color: 'var(--maroon)' }}>browse all profiles</Link></p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm opacity-60">
                  {total === 0 ? 'No profiles found' : `${total} profile${total !== 1 ? 's' : ''} found`}
                </p>
                {!session && (
                  <span className="text-sm flex items-center gap-1.5" style={{ color: 'var(--maroon)' }}>
                    <Lock className="w-3.5 h-3.5" />
                    <Link href="/login" className="font-semibold">Login</Link> to view full profiles
                  </span>
                )}
              </div>

              {total === 0 ? (
                <div className="text-center py-16 opacity-50">
                  <p className="font-medium">No profiles match your search</p>
                  <Link href="/search" className="text-sm mt-2 inline-block underline" style={{ color: 'var(--maroon)' }}>Clear filters</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {profiles.map((profile) => {
                    const tier = profile.user.membershipTier
                    return (
                      <div key={profile.id} className="traditional-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-48 flex items-center justify-center relative" style={{ background: 'var(--cream-dark)' }}>
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
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold"
                              style={{ background: tier === 'ELITE' ? 'var(--gold)' : '#6366f1', color: tier === 'ELITE' ? 'var(--maroon)' : 'white' }}>
                              {tier === 'ELITE' ? '★ Elite' : '◆ Premium'}
                            </span>
                          )}
                          {profile.isFeatured && (
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-semibold" style={{ background: 'var(--gold)', color: 'var(--maroon)' }}>
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
                            {profile.firstName}, {getAge(profile.dob)}
                          </h3>
                          <p className="text-xs opacity-50 mt-0.5">{profile.id.slice(0, 8).toUpperCase()}</p>
                          <div className="mt-2 space-y-0.5 text-sm opacity-70">
                            <p>{profile.religion}{profile.caste ? ` · ${profile.caste}` : ''}</p>
                            {profile.motherTongue && <p>{profile.motherTongue}</p>}
                            <p>{profile.city}, {profile.state}</p>
                            {profile.occupation && <p className="truncate">{profile.occupation}</p>}
                            {profile.annualIncome && <p className="text-xs font-medium" style={{ color: 'var(--maroon)' }}>{profile.annualIncome}</p>}
                            <p className="text-xs mt-1" style={{ color: 'var(--gold)' }}>🟢 {formatLastActive(profile.user.lastActiveAt)}</p>
                          </div>
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

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  {page > 1 && (
                    <Link href={`/search?${new URLSearchParams({ ...params, page: String(page - 1) })}`}
                      className="px-4 py-2 rounded border text-sm" style={{ borderColor: 'var(--border)' }}>
                      Previous
                    </Link>
                  )}
                  <span className="text-sm opacity-60">Page {page} of {totalPages}</span>
                  {page < totalPages && (
                    <Link href={`/search?${new URLSearchParams({ ...params, page: String(page + 1) })}`}
                      className="px-4 py-2 rounded border text-sm" style={{ borderColor: 'var(--border)' }}>
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

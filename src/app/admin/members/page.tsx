import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { approveMember, rejectMember, suspendMember, changeMemberTier, setFeaturedProfile } from '@/app/actions/admin'
import { getAge } from '@/lib/utils'
import type { UserStatus, MembershipTier } from '@/generated/prisma/client'

type SearchParams = { status?: UserStatus; tier?: MembershipTier; q?: string; page?: string }

async function getMembers(params: SearchParams) {
  const page = Math.max(1, parseInt(params.page ?? '1'))
  const pageSize = 20
  const skip = (page - 1) * pageSize

  const where: Record<string, unknown> = { role: 'MEMBER' }
  if (params.status) where.status = params.status
  if (params.tier) where.membershipTier = params.tier
  if (params.q) {
    where.OR = [
      { email: { contains: params.q, mode: 'insensitive' } },
      { profile: { firstName: { contains: params.q, mode: 'insensitive' } } },
    ]
  }

  const [members, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { profile: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ])

  return { members, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export default async function AdminMembersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const { members, total, page, totalPages } = await getMembers(params)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Members</h1>
      <p className="text-sm opacity-60 mb-6">{total} total members</p>

      {/* Filters */}
      <div className="traditional-card rounded-xl p-4 mb-6 flex flex-wrap gap-4">
        <form method="GET" className="flex flex-wrap gap-3 items-center w-full">
          <input name="q" defaultValue={params.q} placeholder="Search by name or email…" className="border rounded px-3 py-2 text-sm flex-1 min-w-48" style={{ borderColor: 'var(--border)' }} />
          <select name="status" defaultValue={params.status} className="border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
            <option value="">All Statuses</option>
            {['PENDING','APPROVED','SUSPENDED','REJECTED'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select name="tier" defaultValue={params.tier} className="border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
            <option value="">All Tiers</option>
            {['FREE','PREMIUM','ELITE'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button type="submit" className="px-4 py-2 rounded text-sm text-white font-medium" style={{ background: 'var(--maroon)' }}>Filter</button>
          <Link href="/admin/members" className="text-sm opacity-60 hover:opacity-100">Clear</Link>
        </form>
      </div>

      {/* Table */}
      <div className="traditional-card rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--cream-dark)' }}>
              <th className="px-5 py-3 text-left text-xs font-semibold opacity-60 uppercase">Member</th>
              <th className="px-5 py-3 text-left text-xs font-semibold opacity-60 uppercase">Details</th>
              <th className="px-5 py-3 text-left text-xs font-semibold opacity-60 uppercase">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold opacity-60 uppercase">Tier</th>
              <th className="px-5 py-3 text-left text-xs font-semibold opacity-60 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((user) => (
              <tr key={user.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                <td className="px-5 py-3">
                  <p className="font-medium">{user.profile?.firstName} {user.profile?.lastName}</p>
                  <p className="text-xs opacity-50">{user.email}</p>
                  <p className="text-xs opacity-50">{new Date(user.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-5 py-3 text-xs opacity-70">
                  {user.profile && (
                    <>
                      <p>{user.profile.gender === 'MALE' ? 'Groom' : 'Bride'}, {getAge(user.profile.dob)} yrs</p>
                      <p>{user.profile.religion}</p>
                      <p>{user.profile.city}, {user.profile.state}</p>
                    </>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: user.status === 'APPROVED' ? '#d1fae5' : user.status === 'PENDING' ? '#fef3c7' : '#fee2e2',
                      color: user.status === 'APPROVED' ? '#065f46' : user.status === 'PENDING' ? '#92400e' : '#991b1b',
                    }}>
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs font-medium" style={{ color: user.membershipTier === 'ELITE' ? '#c9a84c' : user.membershipTier === 'PREMIUM' ? '#6366f1' : '#6b7280' }}>
                    {user.membershipTier}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.status === 'PENDING' && (
                      <form action={async () => { 'use server'; await approveMember(user.id) }}>
                        <button type="submit" className="px-2 py-1 rounded text-xs font-medium text-white bg-green-600">Approve</button>
                      </form>
                    )}
                    {user.status !== 'REJECTED' && (
                      <form action={async (fd: FormData) => { 'use server'; await rejectMember(user.id, fd.get('reason') as string || 'Does not meet requirements') }}>
                        <button type="submit" className="px-2 py-1 rounded text-xs font-medium text-white bg-red-600">Reject</button>
                      </form>
                    )}
                    {user.status === 'APPROVED' && (
                      <form action={async () => { 'use server'; await suspendMember(user.id) }}>
                        <button type="submit" className="px-2 py-1 rounded text-xs font-medium text-white bg-yellow-600">Suspend</button>
                      </form>
                    )}
                    {user.profile && (
                      <form action={async () => { 'use server'; await setFeaturedProfile(user.profile!.id, !user.profile!.isFeatured) }}>
                        <button type="submit" className="px-2 py-1 rounded text-xs font-medium border" style={{ borderColor: 'var(--gold)', color: 'var(--gold-dark)' }}>
                          {user.profile.isFeatured ? 'Unfeature' : 'Feature'}
                        </button>
                      </form>
                    )}
                    <Link href={`/profile/${user.profile?.id}`} className="px-2 py-1 rounded text-xs font-medium border" style={{ borderColor: 'var(--border)' }}>
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs opacity-60">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              {page > 1 && <Link href={`/admin/members?${new URLSearchParams({ ...params, page: String(page - 1) })}`} className="px-3 py-1 rounded border text-xs" style={{ borderColor: 'var(--border)' }}>Previous</Link>}
              {page < totalPages && <Link href={`/admin/members?${new URLSearchParams({ ...params, page: String(page + 1) })}`} className="px-3 py-1 rounded border text-xs" style={{ borderColor: 'var(--border)' }}>Next</Link>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

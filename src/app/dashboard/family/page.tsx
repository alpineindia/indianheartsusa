import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import FamilyManagerForm from '@/components/family/FamilyManagerForm'

async function getFamilyManagers(userId: string) {
  return prisma.familyManager.findMany({
    where: { memberId: userId },
    include: { managerUser: { include: { profile: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function FamilyPage() {
  const session = await verifySession()
  const managers = await getFamilyManagers(session.userId)

  return (
    <>
      <Navbar isLoggedIn isAdmin={session.role === 'ADMIN'} />
      <main className="flex-1" style={{ background: 'var(--background)' }}>
        {/* Header */}
        <div style={{ background: 'var(--maroon)', borderBottom: '3px solid var(--gold)' }} className="py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold mb-3" style={{ color: 'var(--gold-light)' }}>
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Family Members</h1>
            <p style={{ color: 'var(--gold-light)' }} className="text-sm mt-1">Invite family members to help manage your profile</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Add Family Manager Form */}
          <FamilyManagerForm />

          {/* Family Managers List */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
              Current Family Managers
            </h2>

            {managers.length === 0 ? (
              <div className="traditional-card rounded-lg p-6 text-center">
                <p className="opacity-60">No family members have access yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {managers.map((manager) => (
                  <div key={manager.id} className="traditional-card rounded-lg p-4 flex items-center justify-between" style={{ borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--maroon)' }}>
                        {manager.managerUser.profile?.firstName} {manager.managerUser.profile?.lastName}
                      </p>
                      <p className="text-sm opacity-60">{manager.managerUser.email}</p>
                      <p className="text-xs opacity-50 mt-1">Relation: {manager.relation}</p>
                    </div>
                    <form
                      action={async () => {
                        'use server'
                        const { revokeFamilyManager } = await import('@/app/actions/member')
                        await revokeFamilyManager(manager.managerUserId)
                      }}
                    >
                      <button
                        type="submit"
                        className="p-2 rounded text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { computeProfileCompleteness } from '@/lib/utils'
import ProfileSettingsForm from '@/components/profile/ProfileSettingsForm'

export default async function ProfileSettingsPage() {
  const session = await verifySession()
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true },
  })

  if (!user || !user.profile) return null

  const profile = user.profile
  const completeness = computeProfileCompleteness(profile)

  return (
    <>
      <Navbar isLoggedIn isAdmin={session.role === 'ADMIN'} />
      <main className="flex-1" style={{ background: 'var(--background)' }}>
        <div style={{ background: 'var(--maroon)', borderBottom: '3px solid var(--gold)' }} className="py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Edit Profile</h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Profile Completeness */}
          <div className="mb-6 traditional-card rounded-lg p-4 border" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--maroon)' }}>Profile Strength</span>
              <span className="text-sm font-bold" style={{ color: 'var(--gold)' }}>{completeness.percentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.1)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${completeness.percentage}%`, background: 'linear-gradient(90deg, var(--gold), var(--maroon))' }}
              />
            </div>
          </div>

          <ProfileSettingsForm profile={profile} />
        </div>
      </main>
      <Footer />
    </>
  )
}

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { updateProfile } from '@/app/actions/member'
import { revalidatePath } from 'next/cache'

const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Other']
const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

export default async function ProfileSettingsPage() {
  const session = await verifySession()
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true },
  })

  if (!user || !user.profile) return null

  const profile = user.profile

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
          <form
            action={async (fd: FormData) => {
              'use server'
              await updateProfile({
                occupation: fd.get('occupation') as string || undefined,
                education: fd.get('education') as string || undefined,
                annualIncome: fd.get('annualIncome') as string || undefined,
                height: fd.get('height') as string || undefined,
                motherTongue: fd.get('motherTongue') as string || undefined,
                caste: fd.get('caste') as string || undefined,
                city: fd.get('city') as string || profile.city,
                state: fd.get('state') as string || profile.state,
                aboutMe: fd.get('aboutMe') as string || undefined,
                familyType: fd.get('familyType') as string || undefined,
                familyStatus: fd.get('familyStatus') as string || undefined,
              })
              revalidatePath('/dashboard/settings')
            }}
            className="space-y-6"
          >
            {/* Personal */}
            <div className="traditional-card rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">Height</label>
                  <input name="height" defaultValue={profile.height ?? ''} placeholder="e.g. 5'8&quot;" className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">Mother Tongue</label>
                  <input name="motherTongue" defaultValue={profile.motherTongue ?? ''} placeholder="e.g. Tamil, Hindi" className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">Caste / Sub-community</label>
                  <input name="caste" defaultValue={profile.caste ?? ''} className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }} />
                </div>
              </div>
            </div>

            {/* Professional */}
            <div className="traditional-card rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Professional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">Education</label>
                  <input name="education" defaultValue={profile.education ?? ''} placeholder="e.g. MS Computer Science" className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">Occupation</label>
                  <input name="occupation" defaultValue={profile.occupation ?? ''} placeholder="e.g. Software Engineer" className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">Annual Income</label>
                  <input name="annualIncome" defaultValue={profile.annualIncome ?? ''} placeholder="e.g. $100,000 - $150,000" className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }} />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="traditional-card rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Location</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">City</label>
                  <input name="city" defaultValue={profile.city} className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">State</label>
                  <select name="state" defaultValue={profile.state} className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Family */}
            <div className="traditional-card rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Family Background</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">Family Type</label>
                  <select name="familyType" defaultValue={profile.familyType ?? ''} className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Select</option>
                    {['Nuclear','Joint','Extended'].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium opacity-60 mb-1">Family Status</label>
                  <select name="familyStatus" defaultValue={profile.familyStatus ?? ''} className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Select</option>
                    {['Middle Class','Upper Middle Class','Rich','Affluent'].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* About Me */}
            <div className="traditional-card rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>About Me</h2>
              <textarea name="aboutMe" defaultValue={profile.aboutMe ?? ''} rows={5} placeholder="Tell potential matches about yourself, your interests, values, and what you're looking for..." className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }} />
            </div>

            <button type="submit" className="w-full py-3 rounded-lg font-semibold text-sm text-white" style={{ background: 'var(--maroon)' }}>
              Save Changes
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

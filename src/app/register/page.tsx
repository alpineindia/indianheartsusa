'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { register } from '@/app/actions/auth'
import { Heart, ChevronRight } from 'lucide-react'

const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Other']
const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

export default function RegisterPage() {
  const [state, action, pending] = useActionState(register, undefined)
  const [step, setStep] = useState(1)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: 'var(--cream)' }}>
      <div className="w-full max-w-lg traditional-card rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="py-6 px-8 text-center" style={{ background: 'var(--maroon)' }}>
          <Link href="/" className="flex items-center justify-center gap-2 mb-1">
            <Heart className="w-6 h-6 text-red-300" fill="currentColor" />
            <span className="text-white text-xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>IndianHearts USA</span>
          </Link>
          <p style={{ color: 'var(--gold-light)' }} className="text-sm">Create your free profile</p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: step >= s ? 'var(--gold)' : 'rgba(255,255,255,0.2)', color: step >= s ? 'var(--maroon)' : 'white' }}
                >
                  {s}
                </div>
                {s < 3 && <div style={{ width: 32, height: 1, background: step > s ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }} />}
              </div>
            ))}
          </div>
          <div className="flex justify-around mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <span>Account</span>
            <span>Personal</span>
            <span>Location</span>
          </div>
        </div>

        <div className="p-8">
          {state?.message && (
            <div className="mb-4 p-3 rounded text-sm text-red-700 bg-red-50 border border-red-200">
              {state.message}
            </div>
          )}

          <form action={action} className="space-y-4">
            {/* Step 1: Account */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address *</label>
                  <input name="email" type="email" required className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }} placeholder="you@example.com" />
                  {state?.errors?.email && <p className="text-xs text-red-600 mt-1">{state.errors.email[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password *</label>
                  <input name="password" type="password" required className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }} placeholder="Minimum 8 characters" />
                  {state?.errors?.password && <p className="text-xs text-red-600 mt-1">{state.errors.password[0]}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input name="phone" type="tel" className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }} placeholder="+1 555 000 0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">WhatsApp</label>
                    <input name="whatsapp" type="tel" className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }} placeholder="+1 555 000 0000" />
                  </div>
                </div>
                <button type="button" onClick={() => setStep(2)} className="w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2" style={{ background: 'var(--maroon)', color: 'white' }}>
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Step 2: Personal */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name *</label>
                    <input name="firstName" required className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }} placeholder="First name" />
                    {state?.errors?.firstName && <p className="text-xs text-red-600 mt-1">{state.errors.firstName[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name *</label>
                    <input name="lastName" required className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }} placeholder="Last name" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">I am a *</label>
                    <select name="gender" required className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }}>
                      <option value="">Select</option>
                      <option value="MALE">Groom</option>
                      <option value="FEMALE">Bride</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                    <input name="dob" type="date" required className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Religion *</label>
                  <select name="religion" required className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Select religion</option>
                    {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Display your picture for everyone? *</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="displayPicture" value="yes" required className="w-4 h-4" style={{ accentColor: 'var(--gold)' }} />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="displayPicture" value="no" className="w-4 h-4" style={{ accentColor: 'var(--gold)' }} />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Profession *</label>
                  <input name="profession" required className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }} placeholder="e.g. Software Engineer" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Salary (Optional)</label>
                  <input name="salary" className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }} placeholder="e.g. $100,000 - $150,000" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Any Medical Concerns? (Optional)</label>
                  <textarea name="medicalConcerns" className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }} placeholder="Describe any medical concerns..." rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Willing to Relocate? *</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="willingToRelocate" value="yes" required className="w-4 h-4" style={{ accentColor: 'var(--gold)' }} />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="willingToRelocate" value="no" className="w-4 h-4" style={{ accentColor: 'var(--gold)' }} />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Food Preference *</label>
                  <select name="foodPreference" required className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Select preference</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="vegan-eggs">Vegan (prefers egg only)</option>
                    <option value="non-vegetarian">Non-vegetarian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">About You and Your Passion *</label>
                  <textarea name="aboutYou" required className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }} placeholder="Tell us about yourself and your passions..." rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">What are your Expectations? (Optional)</label>
                  <textarea name="expectations" className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }} placeholder="Share your expectations about what you're looking for..." rows={3} />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 rounded-lg font-semibold text-sm border" style={{ borderColor: 'var(--maroon)', color: 'var(--maroon)' }}>
                    Back
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="flex-1 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2" style={{ background: 'var(--maroon)', color: 'white' }}>
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Location + Submit */}
            {step === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input name="city" required className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }} placeholder="e.g. New York" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <select name="state" required className="w-full border rounded-lg px-4 py-2.5 text-sm" style={{ borderColor: 'var(--border)' }}>
                    <option value="">Select state</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="p-3 rounded text-xs" style={{ background: 'var(--cream-dark)', border: '1px solid var(--border)' }}>
                  By registering, you agree that your profile will be reviewed by our admin team before activation. This usually takes less than 24 hours.
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 rounded-lg font-semibold text-sm border" style={{ borderColor: 'var(--maroon)', color: 'var(--maroon)' }}>
                    Back
                  </button>
                  <button type="submit" disabled={pending} className="flex-1 py-3 rounded-lg font-semibold text-sm disabled:opacity-60" style={{ background: 'var(--maroon)', color: 'white' }}>
                    {pending ? 'Submitting…' : 'Submit Profile'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold" style={{ color: 'var(--maroon)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

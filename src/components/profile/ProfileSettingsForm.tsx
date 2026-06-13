'use client'

import { useState, useRef } from 'react'
import { updateProfile } from '@/app/actions/member'

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

interface Profile {
  photoUrls?: string[] | null
  height?: string | null
  motherTongue?: string | null
  caste?: string | null
  education?: string | null
  occupation?: string | null
  annualIncome?: string | null
  city: string
  state: string
  familyType?: string | null
  familyStatus?: string | null
  aboutMe?: string | null
  horoscopeUrl?: string | null
}

export default function ProfileSettingsForm({ profile }: { profile: Profile }) {
  const [photoUrl, setPhotoUrl] = useState(profile.photoUrls?.[0] ?? '')
  const [horoscopeUrl, setHoroscopeUrl] = useState(profile.horoscopeUrl ?? '')
  const [photoUploading, setPhotoUploading] = useState(false)
  const [horoscopeUploading, setHoroscopeUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File, type: 'photo' | 'horoscope'): Promise<string> {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('type', type)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (!res.ok || !data.url) {
      throw new Error(data.error || `HTTP ${res.status}`)
    }
    return data.url
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoUploading(true)
    try {
      const url = await uploadFile(file, 'photo')
      setPhotoUrl(url)
      // Photo saved to state — will be persisted when user clicks Save Changes
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      alert(`Photo upload failed: ${msg}`)
    } finally {
      setPhotoUploading(false)
    }
  }

  async function handleHoroscopeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setHoroscopeUploading(true)
    try {
      const url = await uploadFile(file, 'horoscope')
      setHoroscopeUrl(url)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      alert(`Horoscope upload failed: ${msg}`)
    } finally {
      setHoroscopeUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const fd = new FormData(e.currentTarget)
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
      horoscopeUrl: horoscopeUrl || undefined,
      ...(photoUrl ? { photoUrls: [photoUrl] } : {}),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Photo Upload */}
      <div className="traditional-card rounded-xl p-6">
        <h2 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Profile Photo</h2>
        <div className="flex items-center gap-6">
          <div
            className="w-28 h-28 rounded-full overflow-hidden border-4 flex items-center justify-center bg-gray-100 shrink-0 cursor-pointer relative"
            style={{ borderColor: 'var(--gold)' }}
            onClick={() => photoInputRef.current?.click()}
          >
            {photoUrl ? (
              <img src={photoUrl} alt="Profile photo" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            )}
            {photoUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Profile Photo</p>
            <p className="text-xs opacity-60 mb-3">Recommended: square image, min 400×400px (max 10MB)</p>
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={photoUploading}
              className="px-4 py-2 rounded text-sm font-semibold border disabled:opacity-50"
              style={{ borderColor: 'var(--maroon)', color: 'var(--maroon)' }}
            >
              {photoUploading ? 'Uploading…' : photoUrl ? 'Change Photo' : 'Upload Photo'}
            </button>
            <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            {photoUrl && !photoUploading && (
              <p className="text-xs mt-2 opacity-60">Photo ready — click <strong>Save Changes</strong> below to save.</p>
            )}
          </div>
        </div>
      </div>

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

      {/* Horoscope */}
      <div className="traditional-card rounded-xl p-6">
        <h2 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Horoscope (Optional)</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium opacity-60 mb-1">Horoscope File</label>
            <p className="text-xs opacity-50 mb-2">Accepted formats: JPG, PNG, PDF &nbsp;·&nbsp; Max size: 10 MB</p>
            <input
              type="file"
              accept="image/*,.pdf"
              disabled={horoscopeUploading}
              className="w-full border rounded px-3 py-2 text-sm disabled:opacity-50"
              style={{ borderColor: 'var(--border)' }}
              onChange={handleHoroscopeChange}
            />
            {horoscopeUploading && <p className="text-xs mt-1 opacity-60">Uploading…</p>}
            {horoscopeUrl && !horoscopeUploading && <p className="text-xs mt-1 text-green-600">✓ Horoscope uploaded</p>}
          </div>
          {horoscopeUrl ? (
            <a href={horoscopeUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold px-3 py-2 rounded border shrink-0" style={{ borderColor: 'var(--maroon)', color: 'var(--maroon)' }}>
              View Horoscope
            </a>
          ) : (
            <label className="text-xs font-semibold px-3 py-2 rounded border shrink-0 cursor-pointer" style={{ borderColor: 'var(--maroon)', color: 'var(--maroon)' }}
              onClick={() => (document.querySelector('input[accept="image/*,.pdf"]') as HTMLInputElement)?.click()}>
              Upload Horoscope
            </label>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 rounded-lg font-semibold text-sm text-white disabled:opacity-60 transition-colors"
        style={{ background: saved ? '#16a34a' : 'var(--maroon)' }}
      >
        {saving ? 'Saving…' : saved ? '✓ Changes Saved!' : 'Save Changes'}
      </button>
    </form>
  )
}

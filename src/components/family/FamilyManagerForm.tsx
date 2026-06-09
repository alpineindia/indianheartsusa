'use client'

import { useState } from 'react'
import { inviteFamilyManager } from '@/app/actions/member'

export default function FamilyManagerForm() {
  const [email, setEmail] = useState('')
  const [relation, setRelation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!email || !relation) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const result = await inviteFamilyManager(email, relation)
      if ('error' in result && result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setEmail('')
        setRelation('')
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to send invite. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="traditional-card rounded-lg p-6 border mb-8" style={{ borderColor: 'var(--border)' }}>
      <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--maroon)' }}>Invite Family Member</h2>

      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}>
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
          ✓ Invite sent successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Family Member Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mother@example.com"
            required
            className="w-full border rounded-lg px-4 py-2.5 text-sm"
            style={{ borderColor: 'var(--border)' }}
          />
          <p className="text-xs opacity-60 mt-1">They must be registered on the platform to receive access</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Relation *</label>
          <select
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2.5 text-sm"
            style={{ borderColor: 'var(--border)' }}
          >
            <option value="">Select relation</option>
            <option value="Mother">Mother</option>
            <option value="Father">Father</option>
            <option value="Sister">Sister</option>
            <option value="Brother">Brother</option>
            <option value="Aunt">Aunt</option>
            <option value="Uncle">Uncle</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-semibold text-sm text-white disabled:opacity-50"
          style={{ background: 'var(--maroon)' }}
        >
          {loading ? 'Sending Invite...' : 'Send Invite'}
        </button>
      </form>

      <p className="text-xs opacity-60 mt-4">
        💡 Family members can help manage your profile, respond to interests, and view analytics. They will have full access to your account.
      </p>
    </div>
  )
}

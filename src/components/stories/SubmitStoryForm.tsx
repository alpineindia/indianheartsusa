'use client'

import { useState } from 'react'
import { submitSuccessStory } from '@/app/actions/member'

export default function SubmitStoryForm() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ coupleNames: '', story: '', marriedOn: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await submitSuccessStory(formData.coupleNames, formData.story, formData.marriedOn)
      if ('error' in result) {
        alert(result.error)
      } else {
        setSubmitted(true)
        setFormData({ coupleNames: '', story: '', marriedOn: '' })
        setTimeout(() => {
          setShowForm(false)
          setSubmitted(false)
        }, 2000)
      }
    } catch (err) {
      alert('Failed to submit story. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!showForm) {
    return (
      <div className="text-center mb-12">
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 rounded-lg font-semibold text-white"
          style={{ background: 'var(--maroon)' }}
        >
          📝 Share Your Success Story
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mb-12 traditional-card rounded-xl p-8 border" style={{ borderColor: 'var(--border)' }}>
      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
        Share Your Love Story
      </h2>

      {submitted ? (
        <div className="text-center py-8">
          <p className="text-lg font-semibold mb-2" style={{ color: 'var(--maroon)' }}>✓ Story submitted successfully!</p>
          <p className="text-sm opacity-60">Thank you for sharing your journey. Your story will be reviewed by our team.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Couple Names *</label>
            <input
              type="text"
              value={formData.coupleNames}
              onChange={(e) => setFormData({ ...formData, coupleNames: e.target.value })}
              placeholder="e.g., Priya & Arjun"
              required
              className="w-full border rounded-lg px-4 py-2.5 text-sm"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Your Story *</label>
            <textarea
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              placeholder="Tell us how you met, your journey together, and what love means to you..."
              required
              rows={6}
              className="w-full border rounded-lg px-4 py-2.5 text-sm"
              style={{ borderColor: 'var(--border)' }}
            />
            <p className="text-xs opacity-60 mt-1">Share a meaningful excerpt from your love story (250-500 words recommended)</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Wedding Date (Optional)</label>
            <input
              type="date"
              value={formData.marriedOn}
              onChange={(e) => setFormData({ ...formData, marriedOn: e.target.value })}
              className="w-full border rounded-lg px-4 py-2.5 text-sm"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          <p className="text-xs opacity-60">
            ✓ Your story will be reviewed and published on our success stories page to inspire other members.
          </p>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white disabled:opacity-50"
              style={{ background: 'var(--maroon)' }}
            >
              {loading ? 'Submitting...' : 'Submit Story'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-2.5 rounded-lg font-semibold text-sm border"
              style={{ borderColor: 'var(--border)' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

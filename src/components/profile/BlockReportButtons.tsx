'use client'

import { useState } from 'react'
import { blockUser, reportUser } from '@/app/actions/member'
import { Flag, Ban } from 'lucide-react'

export default function BlockReportButtons({ profileId }: { profileId: string }) {
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDetails, setReportDetails] = useState('')
  const [isBlocked, setIsBlocked] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleBlock = async () => {
    setLoading(true)
    try {
      await blockUser(profileId)
      setIsBlocked(true)
    } catch (err) {
      console.error('Failed to block user:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReport = async () => {
    if (!reportReason) {
      alert('Please select a reason')
      return
    }

    setLoading(true)
    try {
      await reportUser(profileId, reportReason, reportDetails)
      alert('Report submitted. Thank you for helping us keep the community safe.')
      setShowReportForm(false)
      setReportReason('')
      setReportDetails('')
    } catch (err) {
      console.error('Failed to report user:', err)
      alert('Failed to submit report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (isBlocked) {
    return (
      <div className="w-full py-2.5 rounded-lg font-semibold text-sm text-center text-white" style={{ background: '#dc2626' }}>
        ✓ User blocked
      </div>
    )
  }

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={handleBlock}
          disabled={loading}
          className="flex-1 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border disabled:opacity-50"
          style={{ borderColor: '#dc2626', color: '#dc2626' }}
        >
          <Ban className="w-4 h-4" /> Block User
        </button>
        <button
          onClick={() => setShowReportForm(!showReportForm)}
          disabled={loading}
          className="flex-1 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border disabled:opacity-50"
          style={{ borderColor: '#f97316', color: '#f97316' }}
        >
          <Flag className="w-4 h-4" /> Report
        </button>
      </div>

      {showReportForm && (
        <div className="mt-3 p-4 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--cream)' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--maroon)' }}>Report User</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1.5 opacity-60">Reason *</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                style={{ borderColor: 'var(--border)' }}
              >
                <option value="">Select a reason</option>
                <option value="inappropriate-content">Inappropriate content</option>
                <option value="harassment">Harassment or abuse</option>
                <option value="fake-profile">Fake profile</option>
                <option value="scam">Suspected scam</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 opacity-60">Additional details (optional)</label>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Provide any additional context..."
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReport}
                disabled={loading || !reportReason}
                className="flex-1 py-2 rounded-lg font-semibold text-xs text-white disabled:opacity-50"
                style={{ background: '#f97316' }}
              >
                Submit Report
              </button>
              <button
                onClick={() => setShowReportForm(false)}
                className="flex-1 py-2 rounded-lg font-semibold text-xs border"
                style={{ borderColor: 'var(--border)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

import Link from 'next/link'
import { Clock, Heart } from 'lucide-react'

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--cream)' }}>
      <div className="text-center max-w-md traditional-card rounded-xl p-10 shadow-lg">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--cream-dark)', border: '3px solid var(--gold)' }}>
          <Clock className="w-10 h-10" style={{ color: 'var(--gold)' }} />
        </div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-5 h-5" style={{ color: 'var(--maroon)' }} fill="currentColor" />
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
            Profile Under Review
          </h1>
        </div>
        <p className="text-sm opacity-70 mb-6">
          Thank you for registering with IndianHearts USA. Your profile is currently being reviewed by our admin team. This usually takes less than 24 hours.
        </p>
        <p className="text-sm opacity-70 mb-8">
          You will receive an email and WhatsApp notification once your profile is approved.
        </p>
        <Link href="/" className="inline-block px-6 py-3 rounded-full font-semibold text-sm text-white" style={{ background: 'var(--maroon)' }}>
          Back to Home
        </Link>
      </div>
    </div>
  )
}

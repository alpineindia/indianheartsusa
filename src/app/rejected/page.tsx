import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export default function RejectedPage() {
  return (
    <>
      <Navbar isLoggedIn={false} isAdmin={false} />
      <main className="flex-1 flex items-center justify-center py-20 px-4" style={{ background: 'var(--background)' }}>
        <div className="max-w-lg w-full text-center">
          <div className="traditional-card rounded-2xl p-10 shadow-md">
            <div className="text-6xl mb-6">🚫</div>
            <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
              Application Not Approved
            </h1>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              Unfortunately, your profile application was not approved at this time. Our team reviews all applications to ensure the quality and authenticity of our community.
            </p>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Common reasons include incomplete information, unclear photos, or profile details that don&apos;t meet our guidelines. You may re-apply with updated information or contact support for more details.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:support@indianheartsusa.com"
                className="inline-block px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
                style={{ background: 'var(--maroon)' }}
              >
                Contact Support
              </a>
              <Link
                href="/register"
                className="inline-block px-6 py-2.5 rounded-lg text-sm font-semibold border"
                style={{ borderColor: 'var(--gold)', color: 'var(--maroon)' }}
              >
                Re-Apply
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

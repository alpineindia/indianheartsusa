import Link from 'next/link'
import { Heart, Phone, Mail } from 'lucide-react'

const cities = ['New York', 'New Jersey', 'California', 'Texas', 'Illinois', 'Georgia', 'Florida', 'Washington']
const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist']

export default function Footer() {
  return (
    <footer style={{ background: 'var(--maroon)', borderTop: '4px solid var(--gold)', color: '#f5e6d0' }}>
      {/* Ornamental border */}
      <div style={{ height: 4, background: 'linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold) 100%)' }} />

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-6 h-6 text-red-300" fill="currentColor" />
            <span className="text-white text-lg font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>Maangalya USA</span>
          </div>
          <div className="flex flex-col gap-2 text-sm opacity-70">
            <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 321 332 5820</span>
            <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@indianheartsusa.com</span>
          </div>
        </div>

        {/* Browse by City */}
        <div>
          <h4 className="font-semibold mb-3" style={{ color: 'var(--gold-light)' }}>Browse by City</h4>
          <ul className="space-y-1 text-sm opacity-80">
            {cities.map((city) => (
              <li key={city}>
                <Link href={`/browse?city=${encodeURIComponent(city)}`} className="hover:text-yellow-300 transition-colors">
                  {city} Profiles
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Browse by Religion */}
        <div>
          <h4 className="font-semibold mb-3" style={{ color: 'var(--gold-light)' }}>Browse by Religion</h4>
          <ul className="space-y-1 text-sm opacity-80">
            {religions.map((rel) => (
              <li key={rel}>
                <Link href={`/browse?religion=${rel}`} className="hover:text-yellow-300 transition-colors">
                  {rel} Matrimony
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3" style={{ color: 'var(--gold-light)' }}>Quick Links</h4>
          <ul className="space-y-1 text-sm opacity-80">
            {[
              ['Register', '/register'],
              ['Login', '/login'],
              ['Membership Plans', '/membership'],
              ['Success Stories', '/success-stories'],
              ['Browse Profiles', '/browse'],
              ['Privacy Policy', '/privacy'],
              ['Terms of Service', '/terms'],
            ].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="hover:text-yellow-300 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(201,168,76,0.3)' }} className="py-4 text-center text-xs opacity-60">
        <p>© {new Date().getFullYear()} Maangalya USA. All rights reserved. | NRI Matrimonial Platform</p>
      </div>
    </footer>
  )
}

import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'IndianHearts USA — NRI Matrimonial',
  description: 'Find your perfect life partner in the USA. NRI matrimonial platform for Indian Americans. Free, Premium, and Elite membership plans.',
  keywords: 'NRI matrimony USA, Indian matrimonial United States, desi matrimony America, Indian American marriage',
  openGraph: {
    title: 'IndianHearts USA — NRI Matrimonial',
    description: 'Find your perfect life partner among USA-based Indian professionals.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} h-full`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'var(--font-lato), Georgia, serif' }}>
        {children}
      </body>
    </html>
  )
}

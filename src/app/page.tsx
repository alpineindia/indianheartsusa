import Link from 'next/link'
import { Users, Heart, Star, CheckCircle, ArrowRight, ChevronRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { getAge } from '@/lib/utils'

async function getFeaturedProfiles() {
  return prisma.profile.findMany({
    where: { isFeatured: true, user: { status: 'APPROVED' } },
    take: 6,
    orderBy: { createdAt: 'desc' },
  })
}

async function getStats() {
  const [profiles, stories] = await Promise.all([
    prisma.profile.count({ where: { user: { status: 'APPROVED' } } }),
    prisma.successStory.count({ where: { approved: true } }),
  ])
  return { profiles, stories }
}

async function getRecentStories() {
  return prisma.successStory.findMany({
    where: { approved: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })
}


export default async function HomePage() {
  const [session, featured, stats, stories] = await Promise.all([
    getSession(),
    getFeaturedProfiles(),
    getStats(),
    getRecentStories(),
  ])

  return (
    <>
      <Navbar isLoggedIn={!!session} isAdmin={session?.role === 'ADMIN'} />
      <main className="flex-1">
        {/* Hero Section */}
        <section
          style={{
            background: 'linear-gradient(135deg, var(--maroon) 0%, #4a0010 60%, #1a0005 100%)',
            borderBottom: '4px solid var(--gold)',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="py-20 px-4"
        >
          {/* Decorative SVG pattern */}
          <div className="absolute inset-0 opacity-5" aria-hidden>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="lotus" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <circle cx="40" cy="40" r="20" fill="none" stroke="#c9a84c" strokeWidth="1"/>
                  <circle cx="40" cy="40" r="10" fill="none" stroke="#c9a84c" strokeWidth="0.5"/>
                  <line x1="40" y1="20" x2="40" y2="60" stroke="#c9a84c" strokeWidth="0.5"/>
                  <line x1="20" y1="40" x2="60" y2="40" stroke="#c9a84c" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#lotus)"/>
            </svg>
          </div>


          <div style={{display:'none'}}>
            <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" width="300" height="400">
              <defs>
                <radialGradient id="sk_old" cx="52%" cy="35%" r="58%">
                  <stop offset="0%" stopColor="#8c7b68"/>
                  <stop offset="50%" stopColor="#5c4e3e"/>
                  <stop offset="100%" stopColor="#352a20"/>
                </radialGradient>
                <radialGradient id="hd" cx="45%" cy="32%" r="60%">
                  <stop offset="0%" stopColor="#9a8878"/>
                  <stop offset="55%" stopColor="#624e3c"/>
                  <stop offset="100%" stopColor="#382c20"/>
                </radialGradient>
                <radialGradient id="er" cx="50%" cy="48%" r="55%">
                  <stop offset="0%" stopColor="#c49898"/>
                  <stop offset="60%" stopColor="#7a5848"/>
                  <stop offset="100%" stopColor="#3e2c20"/>
                </radialGradient>
                <linearGradient id="gd" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8e472"/>
                  <stop offset="45%" stopColor="#c9a84c"/>
                  <stop offset="100%" stopColor="#8a6018"/>
                </linearGradient>
                <linearGradient id="cp" x1="0%" y1="0%" x2="20%" y2="100%">
                  <stop offset="0%" stopColor="#aa1828"/>
                  <stop offset="100%" stopColor="#5a0010"/>
                </linearGradient>
                <linearGradient id="tk" x1="0%" y1="0%" x2="100%" y2="30%">
                  <stop offset="0%" stopColor="#f0ede0"/>
                  <stop offset="100%" stopColor="#ccc8b0"/>
                </linearGradient>
                <filter id="ds">
                  <feDropShadow dx="2" dy="5" stdDeviation="7" floodColor="#00000055"/>
                </filter>
              </defs>

              {/* TAIL — far left */}
              <path d="M 38 295 Q 16 318 14 348 Q 12 362 24 368" fill="none" stroke="#3a2e22" strokeWidth="9" strokeLinecap="round"/>
              <path d="M 38 295 Q 16 318 14 348 Q 12 362 24 368" fill="none" stroke="#5a4830" strokeWidth="5" strokeLinecap="round"/>
              <ellipse cx="26" cy="371" rx="9" ry="14" fill="#3a2a1a" transform="rotate(8,26,371)"/>

              {/* BODY — large, on left side, head protrudes right */}
              <path d="M 32 348 Q 12 315 16 272 Q 22 222 62 196 Q 102 170 152 168 Q 198 166 228 188 Q 260 212 262 258 Q 264 305 240 338 Q 210 368 158 374 Q 96 380 56 360 Q 34 350 32 348 Z"
                    fill="url(#sk)" filter="url(#ds)"/>
              {/* Belly soft highlight */}
              <path d="M 62 348 Q 130 368 198 360 Q 238 350 250 335" fill="none" stroke="#7a6850" strokeWidth="3" opacity="0.35"/>
              {/* Skin wrinkle at neck */}
              <path d="M 192 225 Q 210 212 232 218" fill="none" stroke="#3a2e22" strokeWidth="2" opacity="0.4"/>
              <path d="M 186 238 Q 208 224 234 230" fill="none" stroke="#3a2e22" strokeWidth="1.5" opacity="0.3"/>

              {/* CAPARISON — richly decorated blanket on back */}
              <path d="M 68 194 Q 158 148 232 186 Q 262 210 262 256 Q 232 234 160 228 Q 106 224 72 240 Q 55 222 68 194 Z"
                    fill="url(#cp)"/>
              {/* Gold outer border */}
              <path d="M 68 194 Q 158 148 232 186 Q 262 210 262 256 Q 232 234 160 228 Q 106 224 72 240 Q 55 222 68 194 Z"
                    fill="none" stroke="url(#gd)" strokeWidth="4"/>
              {/* Inner dashed gold border */}
              <path d="M 80 200 Q 158 158 224 192 Q 250 214 250 248 Q 224 228 160 222 Q 112 218 84 232 Q 68 218 80 200 Z"
                    fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeDasharray="5,4" opacity="0.75"/>
              {/* Jewel clusters on blanket */}
              {[[122,180],[152,170],[182,178],[138,204],[166,202],[152,218]].map(([px,py],i) => (
                <g key={i}>
                  <circle cx={px} cy={py} r="7" fill="#c9a84c"/>
                  <circle cx={px} cy={py} r="5" fill="#fff8e7"/>
                  <circle cx={px} cy={py} r="3" fill="#c9a84c"/>
                  <circle cx={px} cy={py} r="1.4" fill="#fff"/>
                </g>
              ))}
              {/* Gold fringe tassels at hem */}
              {[78,98,118,138,158,178,198,218,238,255].map((x, i) => (
                <g key={i}>
                  <line x1={x} y1={i%2===0 ? 235 : 231} x2={x} y2={i%2===0 ? 252 : 246} stroke="#c9a84c" strokeWidth="1.8"/>
                  <circle cx={x} cy={i%2===0 ? 254 : 248} r="3.5" fill="#c9a84c"/>
                </g>
              ))}

              {/* NECK BELLS */}
              {[[196,240],[214,234],[232,238]].map(([px,py],i) => (
                <g key={i}>
                  <line x1={px} y1={py} x2={px} y2={py+12} stroke="#c9a84c" strokeWidth="2"/>
                  <path d={`M ${px-5} ${py+12} Q ${px} ${py+20} ${px+5} ${py+12}`} fill="#c9a84c"/>
                  <ellipse cx={px} cy={py+8} rx="5" ry="8" fill="#c9a84c" opacity="0.85"/>
                  <line x1={px-2} y1={py+15} x2={px+2} y2={py+15} stroke="#8a6018" strokeWidth="1"/>
                </g>
              ))}

              {/* HEAD — on right side, facing right */}
              <path d="M 182 228 Q 196 175 234 164 Q 268 154 290 182 Q 312 212 300 248 Q 290 278 262 284 Q 234 290 210 272 Q 186 254 182 228 Z"
                    fill="url(#hd)"/>
              {/* Forehead dome highlight */}
              <ellipse cx="248" cy="190" rx="30" ry="22" fill="#8a7860" opacity="0.25"/>

              {/* EAR — large rounded flap, right side */}
              <path d="M 270 175 Q 300 150 318 178 Q 332 205 318 238 Q 304 262 280 256 Q 262 248 264 228 Q 266 205 270 175 Z"
                    fill="url(#er)" filter="url(#ds)"/>
              {/* Ear inner detail */}
              <path d="M 274 183 Q 298 162 310 185 Q 320 208 308 234 Q 296 252 278 246 Q 268 240 270 225 Q 272 206 274 183 Z"
                    fill="#b88080" opacity="0.4"/>
              {/* Ear vein */}
              <path d="M 280 192 Q 306 205 304 232" fill="none" stroke="#6a4840" strokeWidth="1.5" opacity="0.4"/>
              <path d="M 275 212 Q 295 220 294 240" fill="none" stroke="#6a4840" strokeWidth="1" opacity="0.3"/>

              {/* FOREHEAD TILAK JEWEL */}
              <ellipse cx="248" cy="183" rx="18" ry="14" fill="#7a0018"/>
              <ellipse cx="248" cy="183" rx="13" ry="9" fill="url(#gd)"/>
              <ellipse cx="248" cy="183" rx="7" ry="5" fill="#cc1830"/>
              <ellipse cx="248" cy="183" rx="3" ry="2.2" fill="#fff8e7"/>

              {/* GOLD HEADBAND */}
              <path d="M 200 224 Q 244 206 286 220" fill="none" stroke="url(#gd)" strokeWidth="8" strokeLinecap="round"/>
              <path d="M 200 224 Q 244 206 286 220" fill="none" stroke="#fff8e7" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Headband gems */}
              {[[216,217],[244,208],[272,216]].map(([px,py],i) => (
                <g key={i}>
                  <circle cx={px} cy={py} r="5.5" fill="#c9a84c"/>
                  <circle cx={px} cy={py} r="3.5" fill={['#cc2244','#2244cc','#22aa44'][i]}/>
                  <circle cx={px} cy={py} r="1.5" fill="#fff" opacity="0.7"/>
                </g>
              ))}

              {/* CROWN / MUKUT */}
              <path d="M 218 202 L 224 174 L 234 192 L 248 168 L 262 192 L 272 174 L 278 202"
                    fill="none" stroke="url(#gd)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round"/>
              <path d="M 218 202 L 224 174 L 234 192 L 248 168 L 262 192 L 272 174 L 278 202"
                    fill="none" stroke="#fff8e7" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
              <circle cx="224" cy="172" r="6" fill="#c9a84c"/>
              <circle cx="224" cy="172" r="3.8" fill="#ff2244"/>
              <circle cx="248" cy="165" r="8" fill="#c9a84c"/>
              <circle cx="248" cy="165" r="5" fill="#ff1833"/>
              <circle cx="248" cy="165" r="2.2" fill="#fff"/>
              <circle cx="272" cy="172" r="6" fill="#c9a84c"/>
              <circle cx="272" cy="172" r="3.8" fill="#ff2244"/>
              {/* Hanging crown chains */}
              <path d="M 218 204 Q 210 216 214 228" fill="none" stroke="#c9a84c" strokeWidth="1.8"/>
              <circle cx="214" cy="230" r="3.5" fill="#c9a84c"/>
              <path d="M 278 204 Q 286 214 282 226" fill="none" stroke="#c9a84c" strokeWidth="1.8"/>
              <circle cx="282" cy="228" r="3.5" fill="#c9a84c"/>

              {/* EYE — kind and expressive */}
              <ellipse cx="282" cy="216" rx="12" ry="10" fill="#180e04"/>
              <ellipse cx="282" cy="216" rx="9" ry="7.5" fill="#241808"/>
              <ellipse cx="279" cy="212" rx="4.5" ry="3.8" fill="#ffffff" opacity="0.6"/>
              <circle cx="278" cy="212" r="2.2" fill="#ffd700" opacity="0.5"/>
              <path d="M 273 211 Q 282 204 291 212" fill="none" stroke="#100804" strokeWidth="2.2"/>

              {/* TUSK — graceful ivory curve */}
              <path d="M 274 258 Q 240 272 218 292 Q 202 310 210 325 Q 218 338 226 335"
                    fill="none" stroke="#d8d4c4" strokeWidth="10" strokeLinecap="round"/>
              <path d="M 274 258 Q 240 272 218 292 Q 202 310 210 325 Q 218 338 226 335"
                    fill="none" stroke="url(#tk)" strokeWidth="7" strokeLinecap="round"/>
              {/* Tusk gold ring */}
              <ellipse cx="248" cy="278" rx="8" ry="6" fill="none" stroke="url(#gd)" strokeWidth="3.5" transform="rotate(-30,248,278)"/>

              {/* TRUNK — raised UP and curving inward (toward center/right of screen) */}
              {/* Base at snout ~(286,252), sweeps DOWN slightly then arcs UP gracefully, tip near (290,60) */}
              <path d="M 284 254 Q 306 265 305 298 Q 304 328 286 348 Q 272 364 278 384"
                    fill="none" stroke="#2a2018" strokeWidth="28" strokeLinecap="round"/>
              <path d="M 284 254 Q 306 265 305 298 Q 304 328 286 348 Q 272 364 278 384"
                    fill="none" stroke="#5a4830" strokeWidth="22" strokeLinecap="round"/>
              <path d="M 284 254 Q 306 265 305 298 Q 304 328 286 348 Q 272 364 278 384"
                    fill="none" stroke="#6e5a42" strokeWidth="16" strokeLinecap="round"/>
              {/* Trunk skin highlight */}
              <path d="M 282 254 Q 300 264 300 296 Q 299 326 282 346"
                    fill="none" stroke="#8a7258" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
              {/* Trunk tip */}
              <ellipse cx="276" cy="386" rx="9" ry="7" fill="#4a3828" transform="rotate(15,276,386)"/>
              <ellipse cx="276" cy="386" rx="5" ry="4" fill="#2a1e10" transform="rotate(15,276,386)"/>

              {/* FRONT LEGS — slightly bowed/bent toward center (right) */}
              {/* Front right leg (closer to head) — bent forward */}
              <path d="M 210 348 Q 218 365 215 385 Q 213 395 220 398" fill="none" stroke="#3a2e20" strokeWidth="30" strokeLinecap="round"/>
              <path d="M 210 348 Q 218 365 215 385 Q 213 395 220 398" fill="none" stroke="#6a5840" strokeWidth="24" strokeLinecap="round"/>
              <ellipse cx="218" cy="397" rx="16" ry="8" fill="#4a3828"/>
              {/* Front left leg */}
              <path d="M 172 356 Q 175 372 172 390 Q 170 398 176 400" fill="none" stroke="#3a2e20" strokeWidth="28" strokeLinecap="round"/>
              <path d="M 172 356 Q 175 372 172 390 Q 170 398 176 400" fill="none" stroke="#6a5840" strokeWidth="22" strokeLinecap="round"/>
              <ellipse cx="174" cy="399" rx="15" ry="7" fill="#4a3828"/>
              {/* BACK LEGS */}
              <path d="M 110 360 Q 108 376 110 394 Q 111 400 116 400" fill="none" stroke="#3a2e20" strokeWidth="28" strokeLinecap="round"/>
              <path d="M 110 360 Q 108 376 110 394 Q 111 400 116 400" fill="none" stroke="#5e4c38" strokeWidth="22" strokeLinecap="round"/>
              <ellipse cx="112" cy="399" rx="15" ry="7" fill="#4a3828"/>
              <path d="M 68 352 Q 66 368 68 386 Q 69 396 74 398" fill="none" stroke="#3a2e20" strokeWidth="26" strokeLinecap="round"/>
              <path d="M 68 352 Q 66 368 68 386 Q 69 396 74 398" fill="none" stroke="#5e4c38" strokeWidth="20" strokeLinecap="round"/>
              <ellipse cx="70" cy="397" rx="14" ry="7" fill="#4a3828"/>
              {/* ANKLE GOLD BANDS */}
              {[[204,372],[162,370],[100,372],[58,368]].map(([px,py],i) => (
                <ellipse key={i} cx={px} cy={py} rx="15" ry="5" fill="url(#gd)" opacity="0.9"/>
              ))}
              {/* Toe nail details */}
              {[[208,396],[216,396],[224,396]].map(([px,py],i) => (
                <ellipse key={i} cx={px} cy={py} rx="4" ry="3" fill="#2a1e10" opacity="0.7"/>
              ))}

              {/* FLOWERS arcing from trunk tip (bottom right area) upward */}
              {/* Since trunk hangs down, flowers spray outward from bottom */}
              {[[260,370],[240,360],[220,372],[256,388],[242,380]].map(([px,py],i) => (
                <g key={i} transform={`translate(${px},${py})`}>
                  {[0,60,120,180,240,300].map((deg,j) => (
                    <ellipse key={j}
                      cx={Math.round(Math.cos(deg*Math.PI/180)*6)}
                      cy={Math.round(Math.sin(deg*Math.PI/180)*6)}
                      rx="4.5" ry="2.5"
                      fill={['#ffb3c8','#ffd700','#ff9eb5','#fff','#ffcf77','#ffaacc'][i]}
                      opacity="0.95"
                      transform={`rotate(${deg})`}
                    />
                  ))}
                  <circle cx="0" cy="0" r="3" fill={['#ffe066','#ff6600','#ffe066','#ffd700','#ff6600','#ffe066'][i]}/>
                </g>
              ))}
              {/* Petal scatter */}
              {[[248,355],[232,365],[264,360],[250,375],[238,350]].map(([px,py],i) => (
                <ellipse key={i} cx={px} cy={py} rx="5" ry="3"
                  fill={['#ffb3c8','#fff','#ffd700','#ff9eb5','#ffcf77'][i]}
                  opacity="0.8" transform={`rotate(${i*35},${px},${py})`}/>
              ))}
              {/* Gold sparkles near flowers */}
              {[[255,348],[242,345],[268,352],[246,390],[260,385]].map(([px,py],i) => (
                <circle key={i} cx={px} cy={py} r="2.5" fill="#ffd700" opacity="0.85"/>
              ))}
            </svg>
          </div>

          {/* (old right elephant removed) */}
          <div style={{display:'none'}}>
            <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" width="300" height="400">
              <defs>
                <radialGradient id="sk2" cx="52%" cy="35%" r="58%">
                  <stop offset="0%" stopColor="#8c7b68"/>
                  <stop offset="50%" stopColor="#5c4e3e"/>
                  <stop offset="100%" stopColor="#352a20"/>
                </radialGradient>
                <radialGradient id="hd2" cx="45%" cy="32%" r="60%">
                  <stop offset="0%" stopColor="#9a8878"/>
                  <stop offset="55%" stopColor="#624e3c"/>
                  <stop offset="100%" stopColor="#382c20"/>
                </radialGradient>
                <radialGradient id="er2" cx="50%" cy="48%" r="55%">
                  <stop offset="0%" stopColor="#c49898"/>
                  <stop offset="60%" stopColor="#7a5848"/>
                  <stop offset="100%" stopColor="#3e2c20"/>
                </radialGradient>
                <linearGradient id="gd2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8e472"/>
                  <stop offset="45%" stopColor="#c9a84c"/>
                  <stop offset="100%" stopColor="#8a6018"/>
                </linearGradient>
                <linearGradient id="cp2" x1="0%" y1="0%" x2="20%" y2="100%">
                  <stop offset="0%" stopColor="#aa1828"/>
                  <stop offset="100%" stopColor="#5a0010"/>
                </linearGradient>
                <linearGradient id="tk2" x1="0%" y1="0%" x2="100%" y2="30%">
                  <stop offset="0%" stopColor="#f0ede0"/>
                  <stop offset="100%" stopColor="#ccc8b0"/>
                </linearGradient>
                <filter id="ds2">
                  <feDropShadow dx="2" dy="5" stdDeviation="7" floodColor="#00000055"/>
                </filter>
              </defs>
              <path d="M 38 295 Q 16 318 14 348 Q 12 362 24 368" fill="none" stroke="#3a2e22" strokeWidth="9" strokeLinecap="round"/>
              <path d="M 38 295 Q 16 318 14 348 Q 12 362 24 368" fill="none" stroke="#5a4830" strokeWidth="5" strokeLinecap="round"/>
              <ellipse cx="26" cy="371" rx="9" ry="14" fill="#3a2a1a" transform="rotate(8,26,371)"/>
              <path d="M 32 348 Q 12 315 16 272 Q 22 222 62 196 Q 102 170 152 168 Q 198 166 228 188 Q 260 212 262 258 Q 264 305 240 338 Q 210 368 158 374 Q 96 380 56 360 Q 34 350 32 348 Z" fill="url(#sk2)" filter="url(#ds2)"/>
              <path d="M 62 348 Q 130 368 198 360 Q 238 350 250 335" fill="none" stroke="#7a6850" strokeWidth="3" opacity="0.35"/>
              <path d="M 192 225 Q 210 212 232 218" fill="none" stroke="#3a2e22" strokeWidth="2" opacity="0.4"/>
              <path d="M 68 194 Q 158 148 232 186 Q 262 210 262 256 Q 232 234 160 228 Q 106 224 72 240 Q 55 222 68 194 Z" fill="url(#cp2)"/>
              <path d="M 68 194 Q 158 148 232 186 Q 262 210 262 256 Q 232 234 160 228 Q 106 224 72 240 Q 55 222 68 194 Z" fill="none" stroke="url(#gd2)" strokeWidth="4"/>
              <path d="M 80 200 Q 158 158 224 192 Q 250 214 250 248 Q 224 228 160 222 Q 112 218 84 232 Q 68 218 80 200 Z" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeDasharray="5,4" opacity="0.75"/>
              {[[122,180],[152,170],[182,178],[138,204],[166,202],[152,218]].map(([px,py],i) => (
                <g key={i}><circle cx={px} cy={py} r="7" fill="#c9a84c"/><circle cx={px} cy={py} r="5" fill="#fff8e7"/><circle cx={px} cy={py} r="3" fill="#c9a84c"/><circle cx={px} cy={py} r="1.4" fill="#fff"/></g>
              ))}
              {[78,98,118,138,158,178,198,218,238,255].map((x, i) => (
                <g key={i}><line x1={x} y1={i%2===0?235:231} x2={x} y2={i%2===0?252:246} stroke="#c9a84c" strokeWidth="1.8"/><circle cx={x} cy={i%2===0?254:248} r="3.5" fill="#c9a84c"/></g>
              ))}
              {[[196,240],[214,234],[232,238]].map(([px,py],i) => (
                <g key={i}><line x1={px} y1={py} x2={px} y2={py+12} stroke="#c9a84c" strokeWidth="2"/><ellipse cx={px} cy={py+8} rx="5" ry="8" fill="#c9a84c" opacity="0.85"/></g>
              ))}
              <path d="M 182 228 Q 196 175 234 164 Q 268 154 290 182 Q 312 212 300 248 Q 290 278 262 284 Q 234 290 210 272 Q 186 254 182 228 Z" fill="url(#hd2)"/>
              <ellipse cx="248" cy="190" rx="30" ry="22" fill="#8a7860" opacity="0.25"/>
              <path d="M 270 175 Q 300 150 318 178 Q 332 205 318 238 Q 304 262 280 256 Q 262 248 264 228 Q 266 205 270 175 Z" fill="url(#er2)" filter="url(#ds2)"/>
              <path d="M 274 183 Q 298 162 310 185 Q 320 208 308 234 Q 296 252 278 246 Q 268 240 270 225 Q 272 206 274 183 Z" fill="#b88080" opacity="0.4"/>
              <ellipse cx="248" cy="183" rx="18" ry="14" fill="#7a0018"/>
              <ellipse cx="248" cy="183" rx="13" ry="9" fill="url(#gd2)"/>
              <ellipse cx="248" cy="183" rx="7" ry="5" fill="#cc1830"/>
              <ellipse cx="248" cy="183" rx="3" ry="2.2" fill="#fff8e7"/>
              <path d="M 200 224 Q 244 206 286 220" fill="none" stroke="url(#gd2)" strokeWidth="8" strokeLinecap="round"/>
              <path d="M 200 224 Q 244 206 286 220" fill="none" stroke="#fff8e7" strokeWidth="2.5" strokeLinecap="round"/>
              {[[216,217],[244,208],[272,216]].map(([px,py],i) => (
                <g key={i}><circle cx={px} cy={py} r="5.5" fill="#c9a84c"/><circle cx={px} cy={py} r="3.5" fill={['#cc2244','#2244cc','#22aa44'][i]}/><circle cx={px} cy={py} r="1.5" fill="#fff" opacity="0.7"/></g>
              ))}
              <path d="M 218 202 L 224 174 L 234 192 L 248 168 L 262 192 L 272 174 L 278 202" fill="none" stroke="url(#gd2)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round"/>
              <path d="M 218 202 L 224 174 L 234 192 L 248 168 L 262 192 L 272 174 L 278 202" fill="none" stroke="#fff8e7" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
              <circle cx="224" cy="172" r="6" fill="#c9a84c"/><circle cx="224" cy="172" r="3.8" fill="#ff2244"/>
              <circle cx="248" cy="165" r="8" fill="#c9a84c"/><circle cx="248" cy="165" r="5" fill="#ff1833"/><circle cx="248" cy="165" r="2.2" fill="#fff"/>
              <circle cx="272" cy="172" r="6" fill="#c9a84c"/><circle cx="272" cy="172" r="3.8" fill="#ff2244"/>
              <ellipse cx="282" cy="216" rx="12" ry="10" fill="#180e04"/>
              <ellipse cx="282" cy="216" rx="9" ry="7.5" fill="#241808"/>
              <ellipse cx="279" cy="212" rx="4.5" ry="3.8" fill="#ffffff" opacity="0.6"/>
              <path d="M 273 211 Q 282 204 291 212" fill="none" stroke="#100804" strokeWidth="2.2"/>
              <path d="M 274 258 Q 240 272 218 292 Q 202 310 210 325 Q 218 338 226 335" fill="none" stroke="#d8d4c4" strokeWidth="10" strokeLinecap="round"/>
              <path d="M 274 258 Q 240 272 218 292 Q 202 310 210 325 Q 218 338 226 335" fill="none" stroke="url(#tk2)" strokeWidth="7" strokeLinecap="round"/>
              <ellipse cx="248" cy="278" rx="8" ry="6" fill="none" stroke="url(#gd2)" strokeWidth="3.5" transform="rotate(-30,248,278)"/>
              <path d="M 284 254 Q 306 265 305 298 Q 304 328 286 348 Q 272 364 278 384" fill="none" stroke="#2a2018" strokeWidth="28" strokeLinecap="round"/>
              <path d="M 284 254 Q 306 265 305 298 Q 304 328 286 348 Q 272 364 278 384" fill="none" stroke="#5a4830" strokeWidth="22" strokeLinecap="round"/>
              <path d="M 284 254 Q 306 265 305 298 Q 304 328 286 348 Q 272 364 278 384" fill="none" stroke="#6e5a42" strokeWidth="16" strokeLinecap="round"/>
              <path d="M 282 254 Q 300 264 300 296 Q 299 326 282 346" fill="none" stroke="#8a7258" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
              <ellipse cx="276" cy="386" rx="9" ry="7" fill="#4a3828" transform="rotate(15,276,386)"/>
              <path d="M 210 348 Q 218 365 215 385 Q 213 395 220 398" fill="none" stroke="#3a2e20" strokeWidth="30" strokeLinecap="round"/>
              <path d="M 210 348 Q 218 365 215 385 Q 213 395 220 398" fill="none" stroke="#6a5840" strokeWidth="24" strokeLinecap="round"/>
              <ellipse cx="218" cy="397" rx="16" ry="8" fill="#4a3828"/>
              <path d="M 172 356 Q 175 372 172 390 Q 170 398 176 400" fill="none" stroke="#3a2e20" strokeWidth="28" strokeLinecap="round"/>
              <path d="M 172 356 Q 175 372 172 390 Q 170 398 176 400" fill="none" stroke="#6a5840" strokeWidth="22" strokeLinecap="round"/>
              <ellipse cx="174" cy="399" rx="15" ry="7" fill="#4a3828"/>
              <path d="M 110 360 Q 108 376 110 394 Q 111 400 116 400" fill="none" stroke="#3a2e20" strokeWidth="28" strokeLinecap="round"/>
              <path d="M 110 360 Q 108 376 110 394 Q 111 400 116 400" fill="none" stroke="#5e4c38" strokeWidth="22" strokeLinecap="round"/>
              <ellipse cx="112" cy="399" rx="15" ry="7" fill="#4a3828"/>
              <path d="M 68 352 Q 66 368 68 386 Q 69 396 74 398" fill="none" stroke="#3a2e20" strokeWidth="26" strokeLinecap="round"/>
              <path d="M 68 352 Q 66 368 68 386 Q 69 396 74 398" fill="none" stroke="#5e4c38" strokeWidth="20" strokeLinecap="round"/>
              <ellipse cx="70" cy="397" rx="14" ry="7" fill="#4a3828"/>
              {[[204,372],[162,370],[100,372],[58,368]].map(([px,py],i) => (
                <ellipse key={i} cx={px} cy={py} rx="15" ry="5" fill="url(#gd2)" opacity="0.9"/>
              ))}
              {[[260,370],[240,360],[220,372],[256,388],[242,380]].map(([px,py],i) => (
                <g key={i} transform={`translate(${px},${py})`}>
                  {[0,60,120,180,240,300].map((deg,j) => (
                    <ellipse key={j} cx={Math.round(Math.cos(deg*Math.PI/180)*6)} cy={Math.round(Math.sin(deg*Math.PI/180)*6)} rx="4.5" ry="2.5" fill={['#ffb3c8','#ffd700','#ff9eb5','#fff','#ffcf77','#ffaacc'][i]} opacity="0.95" transform={`rotate(${deg})`}/>
                  ))}
                  <circle cx="0" cy="0" r="3" fill={['#ffe066','#ff6600','#ffe066','#ffd700','#ff6600','#ffe066'][i]}/>
                </g>
              ))}
              {[[248,355],[232,365],[264,360],[250,375],[238,350]].map(([px,py],i) => (
                <ellipse key={i} cx={px} cy={py} rx="5" ry="3" fill={['#ffb3c8','#fff','#ffd700','#ff9eb5','#ffcf77'][i]} opacity="0.8" transform={`rotate(${i*35},${px},${py})`}/>
              ))}
              {[[255,348],[242,345],[268,352],[246,390],[260,385]].map(([px,py],i) => (
                <circle key={i} cx={px} cy={py} r="2.5" fill="#ffd700" opacity="0.85"/>
              ))}
            </svg>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div style={{ height: 1, background: 'var(--gold)', flex: 1, maxWidth: 100 }} />
              <span style={{ color: 'var(--gold)', fontSize: 24 }}>✦</span>
              <div style={{ height: 1, background: 'var(--gold)', flex: 1, maxWidth: 100 }} />
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Find Your Perfect
              <br />
              <span style={{ color: 'var(--gold-light)' }}>Life Partner in USA</span>
            </h1>

            {/* Search Widget */}
            <div
              style={{ background: 'rgba(255,248,231,0.97)', border: '2px solid var(--gold)', borderRadius: 12 }}
              className="p-6 max-w-2xl mx-auto"
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--maroon)', fontFamily: 'var(--font-playfair)' }}>
                Find Your Match
              </h2>
              <form action="/browse" method="GET" className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <select name="gender" className="border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--gold)', color: 'var(--foreground)' }}>
                  <option value="">I am a...</option>
                  <option value="MALE">Groom</option>
                  <option value="FEMALE">Bride</option>
                </select>
                <select name="religion" className="border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--gold)' }}>
                  <option value="">Religion</option>
                  {['Hindu','Muslim','Christian','Sikh','Jain','Buddhist','Other'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <select name="ageMin" className="border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--gold)' }}>
                  <option value="">Age Range</option>
                  {Array.from({length: 30}, (_, i) => i + 21).map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded px-4 py-2 text-sm font-semibold"
                  style={{ background: 'var(--maroon)', color: 'white' }}
                >
                  Search
                </button>
              </form>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
              <Link
                href="/register"
                className="px-8 py-3 rounded-full font-semibold text-sm"
                style={{ background: 'var(--gold)', color: 'var(--maroon)' }}
              >
                Register
              </Link>
              <Link
                href="/browse"
                className="px-8 py-3 rounded-full font-semibold text-sm border"
                style={{ borderColor: 'var(--gold)', color: 'var(--gold-light)' }}
              >
                Browse Profiles
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Counters */}
        <section style={{ background: 'var(--cream-dark)', borderBottom: '1px solid var(--border)' }} className="py-8">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Users className="w-8 h-8 mx-auto" />, value: `${stats.profiles.toLocaleString()}+`, label: 'Active Profiles' },
              { icon: <Heart className="w-8 h-8 mx-auto" fill="currentColor" />, value: `${stats.stories}+`, label: 'Success Marriages' },
              { icon: <Star className="w-8 h-8 mx-auto" fill="currentColor" />, value: '5+', label: 'Years Trusted' },
              { icon: <CheckCircle className="w-8 h-8 mx-auto" />, value: '100%', label: 'Admin Verified' },
            ].map(({ icon, value, label }) => (
              <div key={label}>
                <div style={{ color: 'var(--gold)' }}>{icon}</div>
                <div className="text-2xl font-bold mt-1" style={{ color: 'var(--maroon)', fontFamily: 'var(--font-playfair)' }}>{value}</div>
                <div className="text-sm opacity-70">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Profiles */}
        {featured.length > 0 && (
          <section className="py-12 px-4" style={{ background: 'var(--background)' }}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--gold)' }}>Elite Members</p>
                <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Featured Profiles</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map((profile) => (
                  <div key={profile.id} className="traditional-card rounded-lg overflow-hidden shadow-md">
                    <div className="h-48 flex items-center justify-center relative" style={{ background: 'var(--cream-dark)' }}>
                      {profile.photoUrls[0] ? (
                        <img src={profile.photoUrls[0]} alt={profile.firstName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl" style={{ background: 'var(--cream)', border: '2px solid var(--gold)' }}>
                          {profile.gender === 'FEMALE' ? '👰' : '🤵'}
                        </div>
                      )}
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-semibold" style={{ background: 'var(--gold)', color: 'var(--maroon)' }}>★ Elite</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
                        {profile.firstName}, {getAge(profile.dob)}
                      </h3>
                      <p className="text-sm opacity-70">{profile.religion}{profile.caste ? ` · ${profile.caste}` : ''}</p>
                      <p className="text-sm opacity-70">{profile.city}, {profile.state}</p>
                      <Link href={`/profile/${profile.id}`} className="mt-3 flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--maroon)' }}>
                        View Profile <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link href="/browse" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white" style={{ background: 'var(--maroon)' }}>
                  View All Profiles <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }} className="py-12 px-4">
          <div className="max-w-5xl mx-auto text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--gold)' }}>Simple Process</p>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>How It Works</h2>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Register & Create Profile', desc: 'Fill in your details, upload photos, and submit for admin review. Approval usually within 24 hours.' },
              { step: '02', title: 'Browse & Connect', desc: 'Search profiles by religion, caste, location, profession. Send interests and messages to compatible matches.' },
              { step: '03', title: 'Find Your Match', desc: 'Connect via in-app messages, email, or WhatsApp. Upgrade for unlimited access and featured listing.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold" style={{ background: 'var(--maroon)', color: 'var(--gold)' }}>
                  {step}
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>{title}</h3>
                <p className="text-sm opacity-70">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        {stories.length > 0 && (
          <section className="py-12 px-4" style={{ background: 'var(--background)' }}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--gold)' }}>Happy Couples</p>
                <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Success Stories</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <div key={story.id} className="traditional-card rounded-lg p-6">
                    <div className="text-3xl mb-3">💒</div>
                    <h3 className="font-semibold mb-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>{story.coupleNames}</h3>
                    <p className="text-sm opacity-70 line-clamp-4">{story.story}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <Link href="/success-stories" className="text-sm font-semibold" style={{ color: 'var(--maroon)' }}>
                  Read all success stories →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section style={{ background: 'var(--maroon)', borderTop: '4px solid var(--gold)' }} className="py-16 px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
            Ready to Find Your Life Partner?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#f5d0a0' }}>
            Join thousands of Indian Americans finding their perfect match on IndianHearts USA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-3 rounded-full font-semibold" style={{ background: 'var(--gold)', color: 'var(--maroon)' }}>
              Register for Free
            </Link>
            <Link href="/membership" className="px-8 py-3 rounded-full font-semibold border" style={{ borderColor: 'var(--gold)', color: 'var(--gold-light)' }}>
              View Membership Plans
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

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

function ElephantSVG({ s }: { s: string }) {
  return (
    <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" width="380" height="560">
      <defs>
        <radialGradient id={`sk${s}`} cx="45%" cy="38%" r="58%">
          <stop offset="0%" stopColor="#8a8ea8"/><stop offset="55%" stopColor="#52566a"/><stop offset="100%" stopColor="#2e3045"/>
        </radialGradient>
        <linearGradient id={`gd${s}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe56a"/><stop offset="50%" stopColor="#c9a84c"/><stop offset="100%" stopColor="#8a6018"/>
        </linearGradient>
        <linearGradient id={`tk${s}`} x1="0%" y1="0%" x2="100%" y2="60%">
          <stop offset="0%" stopColor="#f5f0d8"/><stop offset="100%" stopColor="#c8c099"/>
        </linearGradient>
        <linearGradient id={`ub${s}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e03030"/><stop offset="100%" stopColor="#8a0010"/>
        </linearGradient>
        <linearGradient id={`hw${s}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8c84a"/><stop offset="50%" stopColor="#c9a84c"/><stop offset="100%" stopColor="#9a7820"/>
        </linearGradient>
        <linearGradient id={`pu${s}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7a20cc"/><stop offset="100%" stopColor="#3a0860"/>
        </linearGradient>
        <filter id={`sh${s}`}><feDropShadow dx="3" dy="5" stdDeviation="7" floodColor="#00000055"/></filter>
        <clipPath id={`cc${s}`}>
          <path d="M 120 268 Q 240 232 360 268 Q 378 316 378 354 Q 350 404 240 410 Q 130 410 102 354 Q 98 316 120 268 Z"/>
        </clipPath>
      </defs>

      {/* ── UMBRELLA ── */}
      <line x1="240" y1="44" x2="240" y2="175" stroke={`url(#gd${s})`} strokeWidth="6"/>
      <path d="M 136 92 Q 148 16 240 10 Q 332 16 344 92 Q 308 76 240 74 Q 172 76 136 92 Z" fill={`url(#ub${s})`}/>
      <path d="M 136 92 Q 148 16 240 10 Q 332 16 344 92" fill="none" stroke={`url(#gd${s})`} strokeWidth="4"/>
      {/* wavy gold stripe across dome */}
      <path d="M 152 66 Q 184 54 216 66 Q 248 78 280 66 Q 312 54 344 68" fill="none" stroke="#f8e472" strokeWidth="2" opacity="0.5"/>
      <ellipse cx="240" cy="12" rx="16" ry="11" fill={`url(#gd${s})`}/>
      <circle cx="240" cy="3" r="5" fill="#c9a84c"/>
      {/* Fringe */}
      {[144,162,180,198,216,234,252,270,288,306,324,338].map((x,i)=>(
        <g key={i}>
          <line x1={x} y1={90} x2={x+(i%2?2:-2)} y2={108} stroke="#c9a84c" strokeWidth="2.2"/>
          <circle cx={x+(i%2?2:-2)} cy={111} r="4" fill="#c9a84c"/>
        </g>
      ))}
      {[140,158,176,194,212,230,248,266,284,302,320,340].map((x,i)=>(
        <line key={i} x1={x} y1={91} x2={x+(i%3===1?3:i%3===2?-3:0)} y2={112} stroke="#8030b0" strokeWidth="2.5" opacity="0.6"/>
      ))}

      {/* ── HOWDAH ── */}
      <rect x="158" y="218" width="184" height="20" rx="5" fill={`url(#hw${s})`}/>
      {[175,215,322,342].map((x,i)=>(
        <rect key={i} x={x-5} y={148} width={10} height={72} rx="3" fill={`url(#gd${s})`}/>
      ))}
      <path d="M 152 153 Q 240 130 350 153 L 354 168 Q 240 145 149 168 Z" fill={`url(#hw${s})`}/>
      <path d="M 152 153 Q 240 130 350 153" fill="none" stroke="#f8e472" strokeWidth="3"/>
      {[168,188,208,228,248,268,288,308,328].map((x,i)=>(
        <circle key={i} cx={x} cy={166} r="6.5" fill={i%2===0?"#ff8800":"#ffcc00"}/>
      ))}
      <rect x="170" y="168" width="168" height="52" fill="#cc2244" opacity="0.5"/>
      <circle cx="240" cy="142" r="10" fill={`url(#gd${s})`}/>
      {/* garland strings from howdah sides */}
      {[0,1,2,3].map(i=>(<circle key={`gl${i}`} cx={172-i*2} cy={238+i*9} r="5.5" fill={i%2===0?"#ff8800":"#ffcc00"}/>))}
      {[0,1,2,3].map(i=>(<circle key={`gr${i}`} cx={340+i*2} cy={238+i*9} r="5.5" fill={i%2===0?"#ff8800":"#ffcc00"}/>))}

      {/* ── MAHOUT ── */}
      <rect x="92" y="255" width="44" height="48" rx="8" fill="#cc2020"/>
      <circle cx="114" cy="248" r="17" fill="#f5d8c0"/>
      <ellipse cx="114" cy="238" rx="22" ry="11" fill="#cc2020"/>
      <ellipse cx="114" cy="235" rx="17" ry="7.5" fill="#dd3333"/>
      <circle cx="114" cy="232" r="5" fill="#c9a84c"/>
      <circle cx="114" cy="232" r="3" fill="#cc2244"/>
      <line x1="130" y1="260" x2="82" y2="330" stroke="#8a6018" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="82" cy="330" r="5" fill="#c9a84c"/>
      <path d="M 100 302 Q 88 320 92 340" fill="none" stroke="#cc2020" strokeWidth="13" strokeLinecap="round"/>
      <path d="M 128 302 Q 140 320 136 340" fill="none" stroke="#cc2020" strokeWidth="13" strokeLinecap="round"/>

      {/* ── BODY ── */}
      <ellipse cx="240" cy="375" rx="148" ry="102" fill={`url(#sk${s})`} filter={`url(#sh${s})`}/>

      {/* tail */}
      <path d="M 378 330 Q 402 358 400 392 Q 396 414 386 420" fill="none" stroke="#2e3045" strokeWidth="9" strokeLinecap="round"/>
      <path d="M 378 330 Q 402 358 400 392 Q 396 414 386 420" fill="none" stroke="#52566a" strokeWidth="5" strokeLinecap="round"/>
      <ellipse cx="384" cy="423" rx="8" ry="12" fill="#2e2e45" transform="rotate(-10,384,423)"/>

      {/* painted body decoration */}
      <path d="M 116 378 Q 104 360 116 344 Q 128 328 142 342 Q 156 356 144 372 Q 132 388 116 378 Z" fill="none" stroke="#3a8a30" strokeWidth="2.2" opacity="0.65"/>
      {[0,60,120,180,240,300].map((deg,i)=>{
        const cx=128+Math.round(Math.cos(deg*Math.PI/180)*8), cy=355+Math.round(Math.sin(deg*Math.PI/180)*8)
        return <ellipse key={i} cx={cx} cy={cy} rx="4" ry="2.5" fill="#cc2244" opacity="0.6" transform={`rotate(${deg},${cx},${cy})`}/>
      })}
      <circle cx="128" cy="355" r="4" fill="#c9a84c" opacity="0.7"/>

      {/* ── CAPARISON purple lower drape ── */}
      <path d="M 108 358 Q 122 446 138 478 Q 184 490 240 488 Q 296 486 350 472 Q 368 432 372 360 Q 342 402 240 410 Q 138 410 108 358 Z" fill={`url(#pu${s})`} opacity="0.92"/>
      <path d="M 108 358 Q 122 446 138 478 Q 184 490 240 488 Q 296 486 350 472 Q 368 432 372 360" fill="none" stroke={`url(#gd${s})`} strokeWidth="4"/>
      {[144,164,184,204,224,244,264,284,304,324,344].map((x,i)=>(
        <g key={i}><line x1={x} y1={484} x2={x} y2={498} stroke="#c9a84c" strokeWidth="2"/><circle cx={x} cy={500} r="4" fill="#c9a84c"/></g>
      ))}
      {[[155,464],[195,470],[235,474],[275,472],[315,466],[352,454]].map(([px,py],i)=>(
        <g key={i}>
          {[0,60,120,180,240,300].map((deg,j)=>{const cx2=px+Math.round(Math.cos(deg*Math.PI/180)*8),cy2=py+Math.round(Math.sin(deg*Math.PI/180)*8); return <ellipse key={j} cx={cx2} cy={cy2} rx="5" ry="3" fill="#cc2244" opacity="0.7" transform={`rotate(${deg},${cx2},${cy2})`}/>})}
          <circle cx={px} cy={py} r="5" fill="#c9a84c"/>
        </g>
      ))}

      {/* ── CAPARISON red/orange striped upper ── */}
      <path d="M 120 268 Q 240 232 360 268 Q 378 316 378 354 Q 350 404 240 410 Q 130 410 102 354 Q 98 316 120 268 Z" fill="#c42020"/>
      <g clipPath={`url(#cc${s})`}>
        {[108,138,168,198,228,258,288,318,348,376].map((x,i)=>(
          <rect key={i} x={x} y={230} width={16} height={192} fill="#ff8800" opacity="0.52"/>
        ))}
      </g>
      <path d="M 120 268 Q 240 232 360 268 Q 378 316 378 354 Q 350 404 240 410 Q 130 410 102 354 Q 98 316 120 268 Z" fill="none" stroke={`url(#gd${s})`} strokeWidth="5"/>
      <path d="M 128 276 Q 240 242 352 276 Q 369 318 369 352 Q 343 397 240 404 Q 137 404 111 352 Q 106 318 128 276 Z" fill="none" stroke="#c9a84c" strokeWidth="2" strokeDasharray="6,4" opacity="0.65"/>
      {/* top marigold garland */}
      <path d="M 120 268 Q 240 238 360 268" fill="none" stroke="#ff8800" strokeWidth="4"/>
      {[126,150,174,198,220,240,262,285,308,332,356].map((x,i)=>(
        <circle key={i} cx={x} cy={i%2?266:261} r="7" fill={i%2?"#ff8800":"#ffcc00"}/>
      ))}
      {/* jewels */}
      {[[175,308],[215,292],[240,284],[278,292],[322,307]].map(([px,py],i)=>(
        <g key={i}>
          <circle cx={px} cy={py} r="10" fill="#c9a84c"/>
          <circle cx={px} cy={py} r="7" fill="#fff8e7"/>
          <circle cx={px} cy={py} r="4" fill={["#cc2244","#2244cc","#22aa44","#cc8800","#cc2244"][i]}/>
          <circle cx={px} cy={py} r="1.8" fill="#fff"/>
        </g>
      ))}

      {/* ── HEAD ── */}
      <path d="M 46 285 Q 42 232 74 206 Q 108 180 150 192 Q 190 204 202 242 Q 214 278 196 312 Q 176 346 142 352 Q 104 358 76 334 Q 44 308 46 285 Z" fill={`url(#sk${s})`} filter={`url(#sh${s})`}/>
      <ellipse cx="112" cy="224" rx="30" ry="20" fill="#8a8ea8" opacity="0.22"/>
      {/* painted forehead */}
      <path d="M 88 218 Q 78 202 96 194 Q 114 186 122 202 Q 130 218 112 226 Q 94 234 88 218 Z" fill="none" stroke="#22aa44" strokeWidth="2.2" opacity="0.75"/>
      {[90,106,124,140,152,158].map((px,i)=>(
        <circle key={i} cx={px} cy={[232,236,230,222,212,225][i]} r="3" fill="#c9a84c" opacity="0.7"/>
      ))}

      {/* ── EAR ── */}
      <path d="M 52 250 Q 2 234 -10 282 Q -20 328 14 358 Q 42 382 76 368 Q 104 356 106 326 Q 108 296 90 272 Q 74 250 52 250 Z" fill={`url(#sk${s})`} filter={`url(#sh${s})`}/>
      <path d="M 48 258 Q 8 246 0 284 Q -8 322 18 348 Q 44 368 72 356 Q 96 346 98 320 Q 100 294 84 273 Q 68 254 48 258 Z" fill="#c09090" opacity="0.38"/>
      <path d="M 28 292 Q 14 282 16 302 Q 18 322 36 325 Q 54 328 56 306 Q 58 286 42 278 Q 26 270 28 292 Z" fill="none" stroke="#22aa44" strokeWidth="1.5" opacity="0.6"/>

      {/* HEADBAND */}
      <path d="M 58 306 Q 118 288 164 302" fill="none" stroke={`url(#gd${s})`} strokeWidth="9" strokeLinecap="round"/>
      <path d="M 58 306 Q 118 288 164 302" fill="none" stroke="#fff8e7" strokeWidth="2.5" strokeLinecap="round"/>
      {[[72,302],[114,289],[152,299]].map(([px,py],i)=>(
        <g key={i}>
          <circle cx={px} cy={py} r="6" fill="#c9a84c"/>
          <circle cx={px} cy={py} r="4" fill={["#cc2244","#2244cc","#22aa44"][i]}/>
          <circle cx={px} cy={py} r="1.8" fill="#fff" opacity="0.8"/>
        </g>
      ))}

      {/* TILAK */}
      <ellipse cx="106" cy="210" rx="15" ry="11" fill="#7a0018"/>
      <ellipse cx="106" cy="210" rx="10" ry="7" fill={`url(#gd${s})`}/>
      <ellipse cx="106" cy="210" rx="5.5" ry="4" fill="#cc1830"/>
      <circle cx="106" cy="210" r="2" fill="#fff8e7"/>

      {/* EYE */}
      <ellipse cx="140" cy="265" rx="11" ry="9" fill="#180e04"/>
      <ellipse cx="140" cy="265" rx="7" ry="5.8" fill="#241808"/>
      <ellipse cx="137" cy="261" rx="3.5" ry="3" fill="#ffffff" opacity="0.65"/>
      <path d="M 130 263 Q 140 256 150 264" fill="none" stroke="#100804" strokeWidth="2"/>

      {/* TUSKS */}
      <path d="M 124 328 Q 78 354 42 364 Q 6 374 -6 408 Q -14 430 2 440 Q 14 446 24 438" fill="none" stroke="#d8d5c2" strokeWidth="12" strokeLinecap="round"/>
      <path d="M 124 328 Q 78 354 42 364 Q 6 374 -6 408 Q -14 430 2 440 Q 14 446 24 438" fill="none" stroke={`url(#tk${s})`} strokeWidth="8" strokeLinecap="round"/>
      <ellipse cx="82" cy="352" rx="9" ry="5.5" fill="none" stroke={`url(#gd${s})`} strokeWidth="3.5" transform="rotate(25,82,352)"/>

      {/* neck bells */}
      {[[120,330],[140,320],[158,324]].map(([px,py],i)=>(
        <g key={i}>
          <line x1={px} y1={py} x2={px} y2={py+14} stroke="#c9a84c" strokeWidth="2"/>
          <path d={`M ${px-6} ${py+14} Q ${px} ${py+24} ${px+6} ${py+14}`} fill="#c9a84c"/>
          <ellipse cx={px} cy={py+10} rx="6" ry="9" fill="#c9a84c" opacity="0.8"/>
        </g>
      ))}

      {/* TRUNK */}
      <path d="M 116 350 Q 94 380 72 412 Q 50 448 44 484 Q 40 512 54 522" fill="none" stroke="#1e2038" strokeWidth="30" strokeLinecap="round"/>
      <path d="M 116 350 Q 94 380 72 412 Q 50 448 44 484 Q 40 512 54 522" fill="none" stroke="#52566a" strokeWidth="24" strokeLinecap="round"/>
      <path d="M 116 350 Q 94 380 72 412 Q 50 448 44 484 Q 40 512 54 522" fill="none" stroke="#6a6e84" strokeWidth="18" strokeLinecap="round"/>
      <path d="M 114 350 Q 92 379 70 411 Q 48 446 42 482" fill="none" stroke="#8a8ea8" strokeWidth="5" strokeLinecap="round" opacity="0.4"/>
      {[[94,396],[78,428],[60,462]].map(([px,py],i)=>(
        <path key={i} d={`M ${px+12} ${py} Q ${px} ${py+7} ${px-12} ${py+2}`} fill="none" stroke="#2e3045" strokeWidth="2" opacity="0.4"/>
      ))}
      <ellipse cx="54" cy="524" rx="10" ry="7" fill="#3a3a50" transform="rotate(-15,54,524)"/>

      {/* LEGS */}
      {[
        [145,432,38,32],[190,437,36,30],[310,442,36,30],[355,436,34,28]
      ].map(([x,y,w,w2],i)=>(
        <g key={i}>
          <path d={`M ${x} ${y} Q ${x} ${y+34} ${x-1} ${y+64} Q ${x-2} ${y+80} ${x+8} ${y+84}`} fill="none" stroke="#1e2038" strokeWidth={w} strokeLinecap="round"/>
          <path d={`M ${x} ${y} Q ${x} ${y+34} ${x-1} ${y+64} Q ${x-2} ${y+80} ${x+8} ${y+84}`} fill="none" stroke="#52566a" strokeWidth={w2} strokeLinecap="round"/>
          <ellipse cx={x+2} cy={y+85} rx="20" ry="10" fill="#2e2e45"/>
        </g>
      ))}
      {/* ankle bands */}
      {[[140,464],[188,469],[308,470],[353,464]].map(([px,py],i)=>(
        <ellipse key={i} cx={px} cy={py} rx="20" ry="6.5" fill={`url(#gd${s})`} opacity="0.95"/>
      ))}
      {/* toenails */}
      {[[136,520],[146,522],[156,521],[186,519],[196,521],[205,520],[304,519],[314,521],[323,520],[349,518],[358,520],[367,518]].map(([px,py],i)=>(
        <ellipse key={i} cx={px} cy={py} rx="4" ry="3" fill="#1e1e2e" opacity="0.7"/>
      ))}
    </svg>
  )
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

          {/* Left Elephant — facing RIGHT toward center */}
          <div className="absolute left-0 top-0 hidden lg:block" style={{ width: 380, height: 560, opacity: 0.92, transform: 'scaleX(-1)' }} aria-hidden>
            <ElephantSVG s="L" />
          </div>

          {/* Right Elephant — faces LEFT toward center */}
          <div className="absolute right-0 top-0 hidden lg:block" style={{ width: 380, height: 560, opacity: 0.92 }} aria-hidden>
            <ElephantSVG s="R" />
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

            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#f5d0a0' }}>
              The trusted NRI matrimonial platform for Indian Americans. Join thousands of Indian professionals finding their soulmate.
            </p>

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
                  <option value="">Age from</option>
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
                Register Free
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

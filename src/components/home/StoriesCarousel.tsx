'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Story {
  id: string
  coupleNames: string
  story: string
  marriedOn: Date | null
}

export default function StoriesCarousel({ stories }: { stories: Story[] }) {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay || stories.length === 0) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % stories.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [autoPlay, stories.length])

  if (stories.length === 0) {
    return null
  }

  const story = stories[current]
  const next = (current + 1) % stories.length
  const prev = (current - 1 + stories.length) % stories.length

  return (
    <div
      className="py-16 px-4"
      style={{ background: 'linear-gradient(135deg, var(--cream) 0%, rgba(200, 150, 80, 0.1) 100%)' }}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--maroon)' }}>
            💕 Happy Couples
          </p>
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
            Success Stories from Our Community
          </h2>
        </div>

        <div className="relative">
          {/* Main Story */}
          <div className="traditional-card rounded-xl p-8 shadow-md text-center min-h-96 flex flex-col justify-between">
            <div>
              <div className="text-6xl mb-4">💒</div>
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
                {story.coupleNames}
              </h3>
              {story.marriedOn && (
                <p className="text-sm opacity-60 mb-4">
                  Married {new Date(story.marriedOn).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </p>
              )}
              <p className="text-lg leading-relaxed opacity-80 italic">"{story.story}"</p>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {stories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    background: idx === current ? 'var(--maroon)' : 'var(--gold)',
                    width: idx === current ? '24px' : '8px',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Navigation */}
          {stories.length > 1 && (
            <>
              <button
                onClick={() => setCurrent(prev)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 p-2 rounded-full hover:shadow-md transition-shadow hidden md:flex items-center justify-center"
                style={{ background: 'var(--maroon)', color: 'white' }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrent(next)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 p-2 rounded-full hover:shadow-md transition-shadow hidden md:flex items-center justify-center"
                style={{ background: 'var(--maroon)', color: 'white' }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="/success-stories"
            className="inline-block px-6 py-3 rounded-lg font-semibold text-white"
            style={{ background: 'var(--maroon)' }}
          >
            Read More Stories →
          </Link>
        </div>
      </div>
    </div>
  )
}

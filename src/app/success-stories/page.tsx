import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

async function getStories() {
  return prisma.successStory.findMany({
    where: { approved: true },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function SuccessStoriesPage() {
  const [session, stories] = await Promise.all([getSession(), getStories()])

  return (
    <>
      <Navbar isLoggedIn={!!session} isAdmin={session?.role === 'ADMIN'} />
      <main className="flex-1" style={{ background: 'var(--background)' }}>
        <div style={{ background: 'var(--maroon)', borderBottom: '3px solid var(--gold)' }} className="py-12 px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--gold-light)' }}>Happy Endings</p>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Success Stories</h1>
          <p className="mt-3 max-w-xl mx-auto" style={{ color: '#f5d0a0' }}>
            Real couples who found love through IndianHearts USA. Their journeys inspire us every day.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {stories.length === 0 ? (
            <p className="text-center opacity-50 py-16">No success stories yet. Be the first!</p>
          ) : (
            <div className="space-y-8">
              {stories.map((story, i) => (
                <div key={story.id} className="traditional-card rounded-xl p-8 shadow-sm flex gap-6">
                  <div className="text-5xl flex-shrink-0">{i % 2 === 0 ? '💒' : '💍'}</div>
                  <div>
                    <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>
                      {story.coupleNames}
                    </h2>
                    {story.marriedOn && (
                      <p className="text-sm opacity-60 mb-3">
                        Married {new Date(story.marriedOn).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed opacity-80">{story.story}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

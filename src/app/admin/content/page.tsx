import { prisma } from '@/lib/prisma'
import { approveSuccessStory, deleteSuccessStory } from '@/app/actions/admin'

async function getStories() {
  return prisma.successStory.findMany({ orderBy: { createdAt: 'desc' } })
}

export default async function AdminContentPage() {
  const stories = await getStories()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--maroon)' }}>Content Management</h1>
      <p className="text-sm opacity-60 mb-8">Manage success stories and site content</p>

      {/* Add Success Story */}
      <div className="traditional-card rounded-xl p-6 mb-8">
        <h2 className="font-semibold mb-4" style={{ color: 'var(--maroon)' }}>Add Success Story</h2>
        <form
          action={async (fd: FormData) => {
            'use server'
            await prisma.successStory.create({
              data: {
                coupleNames: fd.get('coupleNames') as string,
                story: fd.get('story') as string,
                approved: true,
              },
            })
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-xs font-medium opacity-60 mb-1">Couple Names</label>
            <input name="coupleNames" required placeholder="e.g. Priya & Rahul" className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium opacity-60 mb-1">Their Story</label>
            <textarea name="story" required rows={4} className="w-full border rounded px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }} placeholder="Write their success story…" />
          </div>
          <div>
            <button type="submit" className="px-6 py-2 rounded font-semibold text-sm text-white" style={{ background: 'var(--maroon)' }}>Add Story</button>
          </div>
        </form>
      </div>

      {/* Stories List */}
      <div className="traditional-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--maroon)' }}>Success Stories ({stories.length})</h2>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {stories.map((story) => (
            <div key={story.id} className="px-6 py-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{story.coupleNames}</p>
                <p className="text-xs opacity-60 mt-0.5 line-clamp-2">{story.story}</p>
                <span
                  className="mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: story.approved ? '#d1fae5' : '#fef3c7', color: story.approved ? '#065f46' : '#92400e' }}
                >
                  {story.approved ? 'Published' : 'Pending'}
                </span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {!story.approved && (
                  <form action={async () => { 'use server'; await approveSuccessStory(story.id) }}>
                    <button type="submit" className="px-3 py-1 rounded text-xs text-white bg-green-600">Approve</button>
                  </form>
                )}
                <form action={async () => { 'use server'; await deleteSuccessStory(story.id) }}>
                  <button type="submit" className="px-3 py-1 rounded text-xs text-white bg-red-600">Delete</button>
                </form>
              </div>
            </div>
          ))}
          {stories.length === 0 && <p className="px-6 py-8 text-center text-sm opacity-50">No stories yet</p>}
        </div>
      </div>
    </div>
  )
}

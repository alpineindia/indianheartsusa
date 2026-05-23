import Link from 'next/link'
import { MessageCircle, Send } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { verifySession } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { sendMessage } from '@/app/actions/member'

async function getConversations(userId: string) {
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    include: {
      sender: { include: { profile: true } },
      receiver: { include: { profile: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const convMap = new Map<string, typeof messages[0]>()
  for (const msg of messages) {
    const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId
    if (!convMap.has(otherId)) convMap.set(otherId, msg)
  }
  return Array.from(convMap.values())
}

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ to?: string }> }) {
  const session = await verifySession()
  const params = await searchParams
  const conversations = await getConversations(session.userId)

  const activeConvId = params.to
  let activeMessages: Awaited<ReturnType<typeof prisma.message.findMany>> = []
  let activeProfile: Awaited<ReturnType<typeof prisma.profile.findFirst>> | null = null

  if (activeConvId) {
    activeMessages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.userId, receiverId: activeConvId },
          { senderId: activeConvId, receiverId: session.userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    })
    activeProfile = await prisma.profile.findUnique({ where: { userId: activeConvId } })
  }

  return (
    <>
      <Navbar isLoggedIn isAdmin={session.role === 'ADMIN'} />
      <main className="flex-1" style={{ background: 'var(--background)' }}>
        <div style={{ background: 'var(--maroon)', borderBottom: '3px solid var(--gold)' }} className="py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair)' }}>
              <MessageCircle className="w-6 h-6" /> Messages
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6 h-[calc(100vh-200px)]">
          {/* Conversation List */}
          <div className="w-80 flex-shrink-0 traditional-card rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <p className="font-semibold text-sm" style={{ color: 'var(--maroon)' }}>Conversations</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-sm opacity-50">No conversations yet</div>
              ) : conversations.map((msg) => {
                const other = msg.senderId === session.userId ? msg.receiver : msg.sender
                const otherId = msg.senderId === session.userId ? msg.receiverId : msg.senderId
                return (
                  <Link
                    key={otherId}
                    href={`/dashboard/messages?to=${otherId}`}
                    className="flex items-center gap-3 p-4 hover:bg-cream transition-colors border-b"
                    style={{ borderColor: 'var(--border)', background: activeConvId === otherId ? 'var(--cream)' : 'transparent' }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'var(--cream-dark)' }}>
                      {other.profile?.gender === 'FEMALE' ? '👰' : '🤵'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{other.profile?.firstName}</p>
                      <p className="text-xs opacity-50 truncate">{msg.body}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 traditional-card rounded-xl overflow-hidden flex flex-col">
            {activeConvId && activeProfile ? (
              <>
                <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="text-2xl">{activeProfile.gender === 'FEMALE' ? '👰' : '🤵'}</div>
                  <div>
                    <p className="font-semibold text-sm">{activeProfile.firstName}</p>
                    <Link href={`/profile/${activeProfile.id}`} className="text-xs" style={{ color: 'var(--maroon)' }}>View profile →</Link>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {activeMessages.map((msg) => {
                    const isMine = msg.senderId === session.userId
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className="max-w-xs px-4 py-2 rounded-2xl text-sm"
                          style={{
                            background: isMine ? 'var(--maroon)' : 'var(--cream)',
                            color: isMine ? 'white' : 'var(--foreground)',
                            borderBottomRightRadius: isMine ? 4 : undefined,
                            borderBottomLeftRadius: !isMine ? 4 : undefined,
                          }}
                        >
                          {msg.body}
                          <p className="text-xs opacity-50 mt-1">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <form
                  action={async (formData: FormData) => {
                    'use server'
                    const body = formData.get('body') as string
                    if (body?.trim()) await sendMessage(activeConvId, body.trim())
                  }}
                  className="p-4 border-t flex gap-3"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <input
                    name="body"
                    placeholder="Type a message…"
                    className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
                    style={{ borderColor: 'var(--border)' }}
                  />
                  <button type="submit" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--maroon)', color: 'white' }}>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8 opacity-50">
                <div>
                  <MessageCircle className="w-12 h-12 mx-auto mb-3" />
                  <p className="font-medium">Select a conversation</p>
                  <p className="text-sm mt-1">Or browse profiles to start a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

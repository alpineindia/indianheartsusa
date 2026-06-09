'use client'

import { Heart } from 'lucide-react'
import { toggleFavorite } from '@/app/actions/member'
import { useState } from 'react'

export default function FavoriteButton({ profileId, isFavorited }: { profileId: string; isFavorited: boolean }) {
  const [favorited, setFavorited] = useState(isFavorited)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      await toggleFavorite(profileId)
      setFavorited(!favorited)
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border disabled:opacity-50"
      style={{
        borderColor: favorited ? 'var(--maroon)' : 'var(--border)',
        color: favorited ? 'white' : 'var(--maroon)',
        backgroundColor: favorited ? 'var(--maroon)' : 'transparent',
      }}
    >
      <Heart className="w-4 h-4" fill={favorited ? 'currentColor' : 'none'} />
      {favorited ? 'Saved' : 'Save Profile'}
    </button>
  )
}

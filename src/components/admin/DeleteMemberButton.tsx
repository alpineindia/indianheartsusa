'use client'

import { deleteMember } from '@/app/actions/admin'

export default function DeleteMemberButton({ userId, name }: { userId: string; name: string }) {
  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This permanently removes their account and cannot be undone.`)) return
    await deleteMember(userId)
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="px-2 py-1 rounded text-xs font-medium text-white bg-gray-600 hover:bg-gray-800"
    >
      Delete
    </button>
  )
}

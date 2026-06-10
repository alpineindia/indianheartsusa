import { NextRequest } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { getSession } from '@/lib/session'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const type = formData.get('type') as string || 'photo'

  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })
  if (file.size > 10 * 1024 * 1024) return Response.json({ error: 'File too large (max 10MB)' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')
  const dataUri = `data:${file.type};base64,${base64}`

  const uploadOptions: Record<string, unknown> = {
    folder: type === 'horoscope'
      ? `matrimonial-usa/${session.userId}/horoscope`
      : `matrimonial-usa/${session.userId}`,
    resource_type: type === 'horoscope' ? 'auto' : 'image',
  }

  if (type !== 'horoscope') {
    uploadOptions.transformation = [{ width: 800, height: 1000, crop: 'limit', quality: 'auto' }]
  }

  try {
    const result = await cloudinary.uploader.upload(dataUri, uploadOptions)
    return Response.json({ url: result.secure_url, publicId: result.public_id })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[upload] Cloudinary error:', message)
    return Response.json({ error: message }, { status: 500 })
  }
}

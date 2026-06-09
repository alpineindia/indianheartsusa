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
  const buffer = Buffer.from(bytes)

  let uploadOptions: any = {
    folder: `matrimonial-usa/${session.userId}`,
  }

  if (type === 'horoscope') {
    uploadOptions.resource_type = 'auto'
    uploadOptions.folder += '/horoscope'
  } else {
    uploadOptions.resource_type = 'image'
    uploadOptions.transformation = [{ width: 800, height: 1000, crop: 'limit', quality: 'auto' }]
  }

  return new Promise<Response>((resolve) => {
    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error || !result) {
          resolve(Response.json({ error: 'Upload failed' }, { status: 500 }))
          return
        }
        resolve(Response.json({ url: result.secure_url, publicId: result.public_id }))
      }
    ).end(buffer)
  })
}

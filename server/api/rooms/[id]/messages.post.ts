import { getDb } from '../../db'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

export default defineEventHandler(async event => {
  const id = event.context.params?.id
  const db = await getDb()

  const cfg = useRuntimeConfig()
  if (cfg.cloudinaryUrl) cloudinary.config({ url: cfg.cloudinaryUrl })

  let text = ''
  let mediaUrl: string | null = null
  let mediaType: string | null = null
  let senderId: string | null = null

  const contentType = (event.node.req.headers['content-type'] || '') as string
  if (contentType.includes('multipart/form-data')) {
    const { default: formidable } = await import('formidable')
    const form = formidable({
      keepExtensions: true,
      multiples: false,
    })

    const [fields, files]: any = await form.parse(event.node.req)
    text = (fields.text && fields.text[0]) || ''
    senderId = (fields.senderId && fields.senderId[0]) || null

    if (files.media && files.media.length > 0) {
      const file = files.media[0]
      const filePath = file.filepath || file.path || file.filePath || null
      if (filePath && cfg.cloudinaryUrl) {
        try {
          // Upload dengan timeout 30 detik
          const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                resource_type: 'auto',
                timeout: 60000, // 60 detik
              },
              (error: any, res: any) => {
                if (error) return reject(error)
                resolve(res)
              }
            )
            const readStream = fs.createReadStream(filePath)
            readStream.on('error', reject)
            readStream.pipe(uploadStream)
          })

          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Upload timeout')), 50000) // 50 detik
          })

          const result: any = await Promise.race([
            uploadPromise,
            timeoutPromise,
          ])
          mediaUrl = result?.secure_url || null
          mediaType = result?.resource_type || null

          // Cleanup temporary file
          try {
            fs.unlinkSync(filePath)
          } catch (e) {
            console.error('Failed to delete temp file:', e)
          }
        } catch (uploadError: any) {
          console.error('Upload error:', uploadError)
          // Cleanup temporary file on error
          try {
            fs.unlinkSync(filePath)
          } catch (e) {}
          throw createError({
            statusCode: 500,
            message:
              'Gagal upload file: ' + (uploadError.message || 'Unknown error'),
          })
        }
      }
    }
  } else {
    const body = await readBody(event)
    text = body.text || ''
    mediaUrl = body.mediaUrl || null
    mediaType = body.mediaType || null
    senderId = body.senderId || null
  }

  // Validasi: harus ada text atau mediaUrl
  if (!text.trim() && !mediaUrl) {
    throw createError({ statusCode: 400, message: 'Pesan tidak boleh kosong' })
  }

  let senderName = 'Unknown'
  if (senderId) {
    const user = await db.collection('users').findOne({ _id: senderId as any })
    if (user && user.name) senderName = user.name
  }

  const msg: any = {
    _id: crypto.randomUUID(),
    roomId: id,
    text,
    mediaUrl,
    mediaType,
    senderId,
    senderName,
    createdAt: new Date(),
  }

  await db.collection('messages').insertOne(msg as any)
  return msg
})

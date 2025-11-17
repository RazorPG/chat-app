import { getDb } from '../db'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { userId, code } = body

  if (!userId || !code)
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'Missing fields' })
    )

  const db = await getDb()

  // Find valid OTP (support both UUID and ObjectId)
  const otp = await db.collection('otps').findOne({
    userId: userId, // Direct string comparison for UUID
    code: code.toString(),
    expiresAt: { $gt: new Date() },
  })

  if (!otp)
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: 'Invalid or expired OTP' })
    )

  // Delete used OTP
  await db.collection('otps').deleteOne({ _id: otp._id })

  // Get user data (support both UUID and ObjectId)
  const user = await db.collection('users').findOne({ _id: userId })
  if (!user)
    return sendError(
      event,
      createError({ statusCode: 404, statusMessage: 'User not found' })
    )

  // Generate JWT token
  const token = await createToken({ userId: user._id })

  return {
    token,
    user: { _id: user._id, name: user.name, email: user.email },
  }
})

async function createToken(payload: any) {
  const jwtSecret = useRuntimeConfig().jwtSecret || 'change-me'
  const mod = await import('jsonwebtoken')
  const jwtLib = mod && (mod.default || mod)
  const token = jwtLib.sign(payload, jwtSecret, { expiresIn: '30d' })
  return token
}

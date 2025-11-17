import bcrypt from 'bcryptjs'
import { getDb } from '../db'
import { sendOtpEmail } from '../../utils/email'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { email, password } = body
  if (!email || !password)
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'Missing fields' })
    )
  const db = await getDb()
  const user = await db.collection('users').findOne({ email })
  if (!user)
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    )
  const ok = await bcrypt.compare(password, user.password)
  if (!ok)
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    )

  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

  // Save OTP to database
  await db.collection('otps').insertOne({
    userId: user._id.toString ? user._id.toString() : user._id, // Handle both ObjectId and UUID
    email: user.email,
    code: otpCode,
    expiresAt,
    createdAt: new Date(),
    type: 'login',
  })

  // Send OTP via email
  try {
    await sendOtpEmail(user.email, otpCode)
  } catch (error) {
    console.error('Failed to send OTP email:', error)
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: 'Failed to send OTP email',
      })
    )
  }

  return {
    requireOtp: true,
    userId: user._id.toString(),
    email: user.email,
    message: 'OTP sent to your email',
  }
})

async function createToken(payload: any) {
  const jwtSecret = useRuntimeConfig().jwtSecret || 'change-me'
  const mod = await import('jsonwebtoken')
  const jwtLib = mod && (mod.default || mod)
  const token = jwtLib.sign(payload, jwtSecret, { expiresIn: '30d' })
  return token
}

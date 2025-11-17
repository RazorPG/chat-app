import { getDb } from '../db'
import { sendOtpEmail } from '../../utils/email'

export default defineEventHandler(async event => {
  const { email } = await readBody(event)
  if (!email)
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'Missing email' })
    )

  const db = await getDb()
  const user = await db.collection('users').findOne({ email })
  // Always respond success even if user not found (avoid enumeration)
  if (!user) return { message: 'If account exists, OTP sent' }

  // Generate OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

  // Store OTP with type 'reset'
  await db.collection('otps').insertOne({
    userId: user._id.toString ? user._id.toString() : user._id,
    email: user.email,
    code: otpCode,
    expiresAt,
    createdAt: new Date(),
    type: 'reset',
  })

  try {
    await sendOtpEmail(user.email, otpCode)
  } catch (e) {
    console.error('Failed to send reset OTP', e)
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: 'Failed to send OTP email',
      })
    )
  }

  return { message: 'OTP sent if account exists' }
})

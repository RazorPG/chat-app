import { getDb } from '../db'

export default defineEventHandler(async event => {
  const { email, code } = await readBody(event)
  if (!email || !code)
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'Missing fields' })
    )

  const db = await getDb()

  const otp = await db.collection('otps').findOne({
    email,
    code: code.toString(),
    type: 'reset',
    expiresAt: { $gt: new Date() },
  })

  if (!otp)
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: 'Invalid or expired OTP' })
    )

  // Do NOT delete OTP yet; will delete after password successfully set.

  return { verified: true }
})

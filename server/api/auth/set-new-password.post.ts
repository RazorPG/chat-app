import bcrypt from 'bcryptjs'
import { getDb } from '../db'

export default defineEventHandler(async event => {
  const { email, code, newPassword } = await readBody(event)
  if (!email || !code || !newPassword) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'Missing fields' })
    )
  }
  if (newPassword.length < 6) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Password too short (min 6)',
      })
    )
  }

  const db = await getDb()

  const otp = await db.collection('otps').findOne({
    email,
    code: code.toString(),
    type: 'reset',
    expiresAt: { $gt: new Date() },
  })
  if (!otp) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: 'Invalid or expired OTP' })
    )
  }

  const user = await db.collection('users').findOne({ email })
  if (!user) {
    return sendError(
      event,
      createError({ statusCode: 404, statusMessage: 'User not found' })
    )
  }

  const hashed = await bcrypt.hash(newPassword, 10)
  await db
    .collection('users')
    .updateOne({ email }, { $set: { password: hashed } })

  // Delete OTP after successful password change
  await db.collection('otps').deleteOne({ _id: otp._id })

  return { success: true, message: 'Password updated. You can login now.' }
})

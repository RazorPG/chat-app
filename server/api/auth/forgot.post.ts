import { v4 as uuidv4 } from 'uuid'
import { getDb } from '../db'

export default defineEventHandler(async event => {
  const { email } = await readBody(event)
  if (!email)
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'Missing email' })
    )
  const db = await getDb()
  const user = await db.collection('users').findOne({ email })
  if (!user) return { message: 'If account exists, reset link will be sent' }
  const token = uuidv4()
  await db
    .collection('passwordResets')
    .insertOne({ token, userId: user._id, createdAt: new Date() })
  // For development: return token. In production send email via SendGrid/Mailgun.
  return { message: 'Reset token (dev): ' + token }
})

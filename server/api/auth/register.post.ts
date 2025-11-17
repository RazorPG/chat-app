import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import speakeasy from 'speakeasy'
import { getDb } from '../db'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { name, email, password } = body
  if (!email || !password)
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'Missing fields' })
    )
  const db = await getDb()
  const existing = await db.collection('users').findOne({ email })
  if (existing)
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'Email exists' })
    )
  const pw = await bcrypt.hash(password, 10)
  const secret: any = speakeasy.generateSecret({ length: 20 })
  const user = {
    _id: uuidv4(),
    name,
    email,
    password: pw,
    totpSecret: secret.base32,
    createdAt: new Date(),
  }
  await db.collection('users').insertOne(user as any)
  // create jwt
  const token = await createToken({ userId: user._id })
  return {
    token,
    user: { _id: user._id, name: user.name, email: user.email },
    totpProvision: secret.otpauth_url,
  }
})

async function createToken(payload: any) {
  const jwtSecret = useRuntimeConfig().jwtSecret || 'change-me'
  const mod = await import('jsonwebtoken')
  const jwtLib = mod && (mod.default || mod)
  const token = jwtLib.sign(payload, jwtSecret, { expiresIn: '30d' })
  return token
}

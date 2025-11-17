import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import speakeasy from 'speakeasy'
import { getDb } from '../db'

export default defineEventHandler(async event => {
  try {
    const body = await readBody(event).catch(err => {
      console.error('Failed to parse body:', err)
      return {}
    })

    const { name, email, password } = body

    console.log('Register request received:', {
      bodyKeys: Object.keys(body || {}),
      email: email,
      hasPassword: !!password,
      hasName: !!name,
      nameLength: name?.length,
      emailLength: email?.length,
      passwordLength: password?.length,
    })

    if (!email || !password) {
      const errorDetail = {
        email: !!email,
        password: !!password,
        emailValue: email,
        bodyReceived: JSON.stringify(body),
      }
      console.error('Missing required fields:', errorDetail)
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage: 'Missing email or password',
          data: errorDetail,
        })
      )
    }

    const db = await getDb()
    if (!db) {
      console.error('Database connection failed')
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'Database connection failed',
        })
      )
    }
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
    console.log('User created successfully:', user.email)

    // create jwt
    const token = await createToken({ userId: user._id })
    return {
      token,
      user: { _id: user._id, name: user.name, email: user.email },
      totpProvision: secret.otpauth_url,
    }
  } catch (error: any) {
    console.error('Register error:', error)
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage:
          error.message || 'Internal server error during registration',
      })
    )
  }
})

async function createToken(payload: any) {
  const jwtSecret = useRuntimeConfig().jwtSecret || 'change-me'
  const mod = await import('jsonwebtoken')
  const jwtLib = mod && (mod.default || mod)
  const token = jwtLib.sign(payload, jwtSecret, { expiresIn: '30d' })
  return token
}

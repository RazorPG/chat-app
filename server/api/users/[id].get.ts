import { getDb } from '../db'

export default defineEventHandler(async event => {
  const userId = event.context.params?.id

  if (!userId) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'Missing user ID' })
    )
  }

  const db = await getDb()

  try {
    const user = await db.collection('users').findOne({ _id: userId as any })

    if (!user) {
      return sendError(
        event,
        createError({ statusCode: 404, statusMessage: 'User not found' })
      )
    }

    // Return only safe user data (exclude password and OTP)
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }
  } catch (error) {
    console.error('Get user error:', error)
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: 'Failed to get user' })
    )
  }
})

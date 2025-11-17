import { getDb } from '../db'

export default defineEventHandler(async event => {
  const { code, userId } = await readBody(event)

  if (!code || !userId) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'Missing code or userId' })
    )
  }

  const db = await getDb()

  // Find room by code
  const room = await db
    .collection('rooms')
    .findOne({ code: code.toUpperCase() })

  if (!room) {
    return sendError(
      event,
      createError({
        statusCode: 404,
        statusMessage: 'Room not found with this code',
      })
    )
  }

  // Check if user already a member
  const members = room.members || []
  if (members.includes(userId)) {
    return { success: true, room, alreadyMember: true }
  }

  // Add user to members
  await db
    .collection('rooms')
    .updateOne({ _id: room._id }, { $addToSet: { members: userId } })

  return { success: true, room, alreadyMember: false }
})

import { getDb } from '../../db'

export default defineEventHandler(async event => {
  const roomId = event.context.params?.id
  const { userId, action } = await readBody(event)

  if (!userId || !action) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Missing userId or action',
      })
    )
  }

  const db = await getDb()

  if (action === 'join') {
    // Add user to onlineUsers
    await db
      .collection('rooms')
      .updateOne({ _id: roomId }, { $addToSet: { onlineUsers: userId } })
  } else if (action === 'leave') {
    // Remove user from onlineUsers
    await db
      .collection('rooms')
      .updateOne({ _id: roomId }, { $pull: { onlineUsers: userId } })
  }

  // Get updated room
  const room = await db.collection('rooms').findOne({ _id: roomId })

  return {
    success: true,
    onlineCount: room?.onlineUsers?.length || 0,
    onlineUsers: room?.onlineUsers || [],
  }
})

import { getDb } from '../db'

export default defineEventHandler(async event => {
  const id = event.context.params?.id
  const db = await getDb()
  const room = await db.collection('rooms').findOne({ _id: id })
  if (!room)
    return sendError(
      event,
      createError({ statusCode: 404, statusMessage: 'Room not found' })
    )
  return room
})

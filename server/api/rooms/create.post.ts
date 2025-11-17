import { v4 as uuidv4 } from 'uuid'
import { getDb } from '../db'

function makeCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default defineEventHandler(async event => {
  const { name, creatorId } = await readBody(event)
  if (!name)
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'Missing name' })
    )
  const db = await getDb()
  const room = {
    _id: uuidv4(),
    name,
    code: makeCode(),
    createdAt: new Date(),
    creatorId: creatorId || null,
    members: creatorId ? [creatorId] : [],
    onlineUsers: [],
  }
  await db.collection('rooms').insertOne(room as any)
  return room
})

import { getDb } from '../db'

export default defineEventHandler(async event => {
  const query = getQuery(event)
  const userId = query.userId as string

  const db = await getDb()

  // Only return rooms where user is a member
  const filter = userId ? { members: userId } : {}
  const rooms = await db.collection('rooms').find(filter).toArray()

  return rooms
})

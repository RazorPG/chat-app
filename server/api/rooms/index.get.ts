import { getDb } from '../db'

export default defineEventHandler(async event => {
  const db = await getDb()
  const rooms = await db.collection('rooms').find().toArray()
  return rooms
})

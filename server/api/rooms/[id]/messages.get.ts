import { getDb } from '../../db'

export default defineEventHandler(async event => {
  const id = event.context.params?.id
  const db = await getDb()
  const messages = await db
    .collection('messages')
    .find({ roomId: id })
    .sort({ createdAt: 1 })
    .toArray()
  return messages
})

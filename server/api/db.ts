import { MongoClient } from 'mongodb'

const uri = useRuntimeConfig().mongodbUri
if (!uri) throw new Error('MONGODB_URI is not set')

declare global {
  // allow global to store cached client in dev
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!global.__mongoClientPromise) {
  client = new MongoClient(uri)
  clientPromise = client.connect()
  global.__mongoClientPromise = clientPromise
} else {
  clientPromise = global.__mongoClientPromise
}

export async function getDb() {
  const c = await clientPromise
  return c.db()
}

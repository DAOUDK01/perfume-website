import { MongoClient, Db } from 'mongodb';

const uriLocal = process.env.MONGODB_URI_LOCAL;
const uriAtlas = process.env.MONGODB_URI_ATLAS;

if (!uriLocal) {
  throw new Error('Please add your local Mongo URI to .env.local');
}
if (!uriAtlas) {
  throw new Error('Please add your Atlas Mongo URI to .env.local');
}

let clientLocal: MongoClient;
let clientPromiseLocal: Promise<MongoClient>;

let clientAtlas: MongoClient;
let clientPromiseAtlas: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the client is preserved across module reloads
  // caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromiseLocal) {
    clientLocal = new MongoClient(uriLocal);
    global._mongoClientPromiseLocal = clientLocal.connect();
  }
  clientPromiseLocal = global._mongoClientPromiseLocal;

  if (!global._mongoClientPromiseAtlas) {
    clientAtlas = new MongoClient(uriAtlas);
    global._mongoClientPromiseAtlas = clientAtlas.connect();
  }
  clientPromiseAtlas = global._mongoClientPromiseAtlas;
} else {
  // In production mode, it's best to not use a global variable.
  clientLocal = new MongoClient(uriLocal);
  clientPromiseLocal = clientLocal.connect();

  clientAtlas = new MongoClient(uriAtlas);
  clientPromiseAtlas = clientAtlas.connect();
}

export async function connectToLocalDb(): Promise<{ client: MongoClient; db: Db }> {
  const client = await clientPromiseLocal;
  const dbName = new URL(uriLocal!).pathname.substring(1); // Extract db name from URI
  return { client, db: client.db(dbName) };
}

export async function connectToAtlasDb(): Promise<{ client: MongoClient; db: Db }> {
  const client = await clientPromiseAtlas;
  const dbName = new URL(uriAtlas!).pathname.substring(1); // Extract db name from URI
  return { client, db: client.db(dbName) };
}

// Export a module-scoped MongoClient object. By doing this in a
// separate module, the client can be shared across functions.
export { clientPromiseLocal, clientPromiseAtlas };

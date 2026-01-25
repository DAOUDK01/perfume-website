import { MongoClient, Db } from 'mongodb';

const uriLocal = process.env.MONGODB_URI_LOCAL;
const uriAtlas = process.env.MONGODB_URI_ATLAS;

let clientLocal: MongoClient;
let clientPromiseLocal: Promise<MongoClient>;

let clientAtlas: MongoClient;
let clientPromiseAtlas: Promise<MongoClient>;

function getClientPromiseLocal(): Promise<MongoClient> {
  if (!uriLocal) {
    throw new Error('Please add your local Mongo URI to .env.local');
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromiseLocal) {
      clientLocal = new MongoClient(uriLocal);
      global._mongoClientPromiseLocal = clientLocal.connect();
    }
    return global._mongoClientPromiseLocal;
  } else {
    if (!clientPromiseLocal) {
      clientLocal = new MongoClient(uriLocal);
      clientPromiseLocal = clientLocal.connect();
    }
    return clientPromiseLocal;
  }
}

function getClientPromiseAtlas(): Promise<MongoClient> {
  if (!uriAtlas) {
    throw new Error('Please add your Atlas Mongo URI to .env.local');
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromiseAtlas) {
      clientAtlas = new MongoClient(uriAtlas);
      global._mongoClientPromiseAtlas = clientAtlas.connect();
    }
    return global._mongoClientPromiseAtlas;
  } else {
    if (!clientPromiseAtlas) {
      clientAtlas = new MongoClient(uriAtlas);
      clientPromiseAtlas = clientAtlas.connect();
    }
    return clientPromiseAtlas;
  }
}

export async function connectToLocalDb(): Promise<{ client: MongoClient; db: Db }> {
  const client = await getClientPromiseLocal();
  const dbName = new URL(uriLocal!).pathname.substring(1); // Extract db name from URI
  return { client, db: client.db(dbName) };
}

export async function connectToAtlasDb(): Promise<{ client: MongoClient; db: Db }> {
  const client = await getClientPromiseAtlas();
  const dbName = new URL(uriAtlas!).pathname.substring(1); // Extract db name from URI
  return { client, db: client.db(dbName) };
}

// Export a module-scoped MongoClient object. By doing this in a
// separate module, the client can be shared across functions.
export { clientPromiseLocal, clientPromiseAtlas };

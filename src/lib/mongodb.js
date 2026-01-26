import { MongoClient } from 'mongodb';

const uriLocal = process.env.MONGODB_URI_LOCAL;
const uriAtlas = process.env.MONGODB_URI || process.env.MONGODB_URI_ATLAS || process.env.MONGO_URI;

let clientLocal;
let clientPromiseLocal = null;

let clientAtlas;
let clientPromiseAtlas = null;

function getClientPromiseLocal() {
  if (!uriLocal) {
    console.warn('MONGODB_URI_LOCAL is not defined. Local DB connection will be skipped.');
    return null;
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

function getClientPromiseAtlas() {
  if (!uriAtlas) {
    console.warn('MONGODB_URI, MONGODB_URI_ATLAS, or MONGO_URI is not defined. Atlas DB connection will be skipped.');
    return null;
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

export async function connectToLocalDb() {
  const promise = getClientPromiseLocal();
  if (!promise) {
    return { 
      client: null, 
      db: createDummyDb('Local')
    };
  }
  const client = await promise;
  const dbName = new URL(uriLocal).pathname.substring(1) || 'test'; 
  return { client, db: client.db(dbName) };
}

export async function connectToAtlasDb() {
  const promise = getClientPromiseAtlas();
  if (!promise) {
    return { 
      client: null, 
      db: createDummyDb('Atlas')
    };
  }
  const client = await promise;
  
  let dbName = 'test';
  try {
    // Handle mongodb+srv:// or mongodb:// URIs
    const url = new URL(uriAtlas.replace('mongodb+srv://', 'http://'));
    dbName = url.pathname.substring(1).split('?')[0] || 'test';
  } catch (e) {
    console.error('Error parsing Atlas URI:', e);
  }
  
  console.log(`[MongoDB] Connecting to Atlas DB: ${dbName}`);
  return { client, db: client.db(dbName) };
}

/**
 * Creates a dummy DB object that doesn't crash but returns empty results
 */
function createDummyDb(name) {
  const dummyCollection = {
    find: () => ({
      sort: () => ({
        toArray: async () => [],
        limit: () => ({ toArray: async () => [] }),
      }),
      toArray: async () => [],
    }),
    findOne: async () => null,
    insertOne: async () => ({ insertedId: null }),
    updateOne: async () => ({ matchedCount: 0, modifiedCount: 0 }),
    deleteOne: async () => ({ deletedCount: 0 }),
    countDocuments: async () => 0,
    aggregate: () => ({
      toArray: async () => [],
    }),
  };

  return {
    collection: () => dummyCollection,
    _isDummy: true,
    _name: name
  };
}

// Export module-scoped client promises
export { clientPromiseLocal, clientPromiseAtlas };
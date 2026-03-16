import { MongoClient, Db } from "mongodb";

const uriLocal = process.env.MONGODB_URI_LOCAL;
const uriAtlas =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URI_ATLAS ||
  process.env.MONGO_URI;

let clientLocal: MongoClient;
let clientPromiseLocal: Promise<MongoClient> | null = null;

let clientAtlas: MongoClient;
let clientPromiseAtlas: Promise<MongoClient> | null = null;

function getClientPromiseLocal(): Promise<MongoClient> | null {
  if (!uriLocal) {
    console.warn(
      "MONGODB_URI_LOCAL is not defined. Local DB connection will be skipped.",
    );
    return null;
  }

  const options = {
    serverSelectionTimeoutMS: 5000, // 5 seconds
    connectTimeoutMS: 10000, // 10 seconds
    socketTimeoutMS: 15000, // 15 seconds
    maxPoolSize: 10,
    minPoolSize: 2,
  };

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromiseLocal) {
      clientLocal = new MongoClient(uriLocal, options);
      global._mongoClientPromiseLocal = clientLocal.connect();
    }
    return global._mongoClientPromiseLocal;
  } else {
    if (!clientPromiseLocal) {
      clientLocal = new MongoClient(uriLocal, options);
      clientPromiseLocal = clientLocal.connect();
    }
    return clientPromiseLocal;
  }
}

function getClientPromiseAtlas(): Promise<MongoClient> | null {
  if (!uriAtlas) {
    console.warn(
      "MONGODB_URI, MONGODB_URI_ATLAS, or MONGO_URI is not defined. Atlas DB connection will be skipped.",
    );
    return null;
  }

  const options = {
    serverSelectionTimeoutMS: 8000, // 8 seconds for Atlas
    connectTimeoutMS: 15000, // 15 seconds for Atlas
    socketTimeoutMS: 20000, // 20 seconds for Atlas
    maxPoolSize: 10,
    minPoolSize: 2,
    retryWrites: true,
  };

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromiseAtlas) {
      clientAtlas = new MongoClient(uriAtlas, options);
      global._mongoClientPromiseAtlas = clientAtlas.connect();
    }
    return global._mongoClientPromiseAtlas;
  } else {
    if (!clientPromiseAtlas) {
      clientAtlas = new MongoClient(uriAtlas, options);
      clientPromiseAtlas = clientAtlas.connect();
    }
    return clientPromiseAtlas;
  }
}

export async function connectToLocalDb(): Promise<{
  client: MongoClient | null;
  db: Db | any;
}> {
  const promise = getClientPromiseLocal();
  if (!promise) {
    return {
      client: null,
      db: createDummyDb("Local"),
    };
  }
  const client = await promise;
  const dbName = new URL(uriLocal!).pathname.substring(1) || "test";
  return { client, db: client.db(dbName) };
}

export async function connectToAtlasDb(): Promise<{
  client: MongoClient | null;
  db: Db | any;
}> {
  const promise = getClientPromiseAtlas();
  if (!promise) {
    return {
      client: null,
      db: createDummyDb("Atlas"),
    };
  }
  const client = await promise;

  let dbName = "test";
  try {
    // Handle mongodb+srv:// or mongodb:// URIs
    const url = new URL(uriAtlas!.replace("mongodb+srv://", "http://"));
    dbName = url.pathname.substring(1).split("?")[0] || "test";
  } catch (e) {
    console.error("Error parsing Atlas URI:", e);
  }

  console.log(`[MongoDB] Connecting to Atlas DB: ${dbName}`);
  return { client, db: client.db(dbName) };
}

/**
 * Creates a dummy DB object that doesn't crash but returns empty results
 */
function createDummyDb(name: string) {
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
    _name: name,
  };
}

/**
 * Utility function to wrap database operations with timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = "Database operation timed out",
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`${errorMessage} after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timeout);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeout);
        reject(error);
      });
  });
}

/**
 * Safely execute database operation with fallback
 */
export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  fallback: T = [] as any,
  timeoutMs: number = 5000,
  operationName: string = "Database operation",
): Promise<T> {
  try {
    return await withTimeout(
      operation(),
      timeoutMs,
      `${operationName} timed out`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[MongoDB] ${operationName} failed:`, message);
    return fallback;
  }
}

// Export a module-scoped MongoClient object. By doing this in a
// separate module, the client can be shared across functions.
export { clientPromiseLocal, clientPromiseAtlas };

import { MongoClient } from "mongodb";

const uriLocal = process.env.MONGODB_URI_LOCAL;
const uriAtlas =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URI_ATLAS ||
  process.env.MONGO_URI;

let clientLocal;
let clientPromiseLocal = null;

let clientAtlas;
let clientPromiseAtlas = null;

function getClientPromiseLocal() {
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

function getClientPromiseAtlas() {
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

export async function connectToLocalDb() {
  const promise = getClientPromiseLocal();
  if (!promise) {
    console.log("[MongoDB] Local DB: Skipped (no URI configured)");
    return {
      client: null,
      db: createDummyDb("Local"),
    };
  }

  try {
    const client = await promise;
    const dbName = new URL(uriLocal).pathname.substring(1) || "test";
    console.log("[MongoDB] Local DB: Connected successfully");
    return { client, db: client.db(dbName) };
  } catch (error) {
    console.warn("[MongoDB] Local DB: Connection failed -", error.message);
    return { client: null, db: createDummyDb("Local") };
  }
}

export async function connectToAtlasDb() {
  const promise = getClientPromiseAtlas();
  if (!promise) {
    console.log("[MongoDB] Atlas DB: Skipped (no URI configured)");
    return {
      client: null,
      db: createDummyDb("Atlas"),
    };
  }

  try {
    const client = await promise;

    let dbName = "test";
    try {
      // Handle mongodb+srv:// or mongodb:// URIs
      const url = new URL(uriAtlas.replace("mongodb+srv://", "http://"));
      dbName = url.pathname.substring(1).split("?")[0] || "test";
    } catch (e) {
      console.error("[MongoDB] Atlas DB: Error parsing URI:", e);
    }

    console.log(`[MongoDB] Atlas DB: Connected successfully to ${dbName}`);
    return { client, db: client.db(dbName) };
  } catch (error) {
    // Handle specific DNS/network errors for MongoDB Atlas
    if (
      error.code === "ESERVFAIL" ||
      error.code === "ENOTFOUND" ||
      error.message.includes("querySrv")
    ) {
      console.warn(
        `[MongoDB] Atlas DB: DNS resolution failed - ${uriAtlas?.split("@")[1]?.split("/")[0] || "unknown cluster"}`,
      );
      console.warn(
        "[MongoDB] Atlas DB: Check if your cluster is running and network connection is stable",
      );
    } else if (error.code === "ETIMEDOUT") {
      console.warn(
        "[MongoDB] Atlas DB: Connection timed out - cluster may be slow or unreachable",
      );
    } else {
      console.warn("[MongoDB] Atlas DB: Connection failed -", error.message);
    }
    return { client: null, db: createDummyDb("Atlas") };
  }
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
    _name: name,
  };
}

/**
 * Utility function to wrap database operations with timeout
 */
export async function withTimeout(
  promise,
  timeoutMs,
  errorMessage = "Database operation timed out",
) {
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
export async function safeDbOperation(
  operation,
  fallback = [],
  timeoutMs = 5000,
  operationName = "Database operation",
) {
  try {
    return await withTimeout(
      operation(),
      timeoutMs,
      `${operationName} timed out`,
    );
  } catch (error) {
    // Categorize error types for better debugging
    let errorType = "Unknown";
    if (
      error.code === "ESERVFAIL" ||
      error.code === "ENOTFOUND" ||
      error.message.includes("querySrv")
    ) {
      errorType = "DNS Resolution";
    } else if (
      error.code === "ETIMEDOUT" ||
      error.message.includes("timed out")
    ) {
      errorType = "Timeout";
    } else if (error.code === "ECONNREFUSED") {
      errorType = "Connection Refused";
    } else if (error.message.includes("Authentication failed")) {
      errorType = "Authentication";
    }

    console.warn(
      `[MongoDB] ${operationName} failed (${errorType}):`,
      error.message,
    );
    return fallback;
  }
}

// Export module-scoped client promises
export { clientPromiseLocal, clientPromiseAtlas };

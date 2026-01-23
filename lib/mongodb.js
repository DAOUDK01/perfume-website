import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    console.log("Connecting to MongoDB:", MONGODB_URI);

    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    const db = client.db("eeora");

    cachedClient = client;
    cachedDb = db;

    console.log("✅ Connected to MongoDB");
    return { client, db };
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function getOrdersCollection() {
  const { db } = await connectToDatabase();
  return db.collection("orders");
}

export async function getProductsCollection() {
  const { db } = await connectToDatabase();
  return db.collection("products");
}

export async function getUsersCollection() {
  const { db } = await connectToDatabase();
  return db.collection("users");
}

export async function getSettingsCollection() {
  const { db } = await connectToDatabase();
  return db.collection("settings");
}

export async function getContentCollection() {
  const { db } = await connectToDatabase();
  return db.collection("content");
}

import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const options = {};

let client;
let clientPromise;
let db;

if (!uri) {
  throw new Error('Please add your MONGO_URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getClient() {
  return clientPromise;
}

export async function getDb() {
  try {
    const clientInstance = await getClient();
    console.log('Connecting to MongoDB:', uri);
    db = clientInstance.db();
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function getUsersCollection() {
  const db = await getDb();
  return db.collection("users");
}

export async function getProductsCollection() {
  const db = await getDb();
  return db.collection("products");
}

export async function getOrdersCollection() {
  const db = await getDb();
  return db.collection("orders");
}
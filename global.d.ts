import { MongoClient, Db } from 'mongodb';

declare global {
  var _mongoClientPromiseLocal: Promise<MongoClient> | undefined;
  var _mongoClientPromiseAtlas: Promise<MongoClient> | undefined;
}

import { NextResponse } from 'next/server';
import { connectToLocalDb, connectToAtlasDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    // Example: Insert data into both databases
    const testData = {
      message: 'Hello from dual DB example!',
      timestamp: new Date(),
    };

    const localInsertResult = await localDb.collection('test_collection').insertOne(testData);
    const atlasInsertResult = await atlasDb.collection('test_collection').insertOne(testData);

    // Example: Query data from both databases
    const localData = await localDb.collection('test_collection').find({}).toArray();
    const atlasData = await atlasDb.collection('test_collection').find({}).toArray();

    return NextResponse.json({
      message: 'Dual database operation successful!',
      localDb: {
        insertId: localInsertResult.insertedId,
        data: localData,
      },
      atlasDb: {
        insertId: atlasInsertResult.insertedId,
        data: atlasData,
      },
    });
  } catch (error: any) {
    console.error('Dual DB example error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

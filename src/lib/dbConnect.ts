import type { MongoClientOptions } from 'mongodb';
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri: string = process.env.MONGODB_URI;
const options: MongoClientOptions = {};

interface GlobalWithMongo extends Global {
  _mongoClientPromise?: Promise<MongoClient>;
}

declare const global: GlobalWithMongo;

const client: MongoClient = new MongoClient(uri, options);

const clientPromise: Promise<MongoClient> = ((): Promise<MongoClient> => {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      console.log('Creating new MongoDB connection');
      global._mongoClientPromise = client.connect();
    } else {
      console.log('Reusing existing MongoDB connection');
    }
    return global._mongoClientPromise;
  }
  console.log('Creating new MongoDB connection (production mode)');
  return client.connect();
})();

export default clientPromise;

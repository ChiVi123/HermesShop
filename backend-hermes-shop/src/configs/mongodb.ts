import { MongoClient, ServerApiVersion } from 'mongodb';
import env from '~/configs/environment';

export const mongoClientInstance = new MongoClient(env.MONGO_URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

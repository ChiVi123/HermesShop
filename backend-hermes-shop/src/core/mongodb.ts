import type { Db } from 'mongodb';
import env from '~/configs/environment';
import { mongoClientInstance } from '~/configs/mongodb';

let mongoDatabaseInstance: Db | null = null;

export const connectDB = async () => {
  await mongoClientInstance.connect();
  mongoDatabaseInstance = mongoClientInstance.db(env.MONGO_DATABASE_NAME);
};
export const getDB = () => {
  if (!mongoDatabaseInstance) throw new Error('Must connect to Database first');
  return mongoDatabaseInstance;
};
export const closeDB = async () => {
  await mongoClientInstance.close();
  logging.info('Mongodb connection closed');
};

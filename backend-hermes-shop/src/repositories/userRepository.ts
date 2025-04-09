import type { InsertOneResult, ObjectId, WithId } from 'mongodb';

interface UserRepository<T> {
  create: (data: Record<string, unknown>) => Promise<InsertOneResult<T>>;
  findOneById: (id: string | ObjectId) => Promise<WithId<T> | null>;
  findOneByEmail: (email: string) => Promise<WithId<T> | null>;
}

export type { UserRepository };

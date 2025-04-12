import type { InsertOneResult, WithId } from 'mongodb';

interface UserRepository<T> {
  create: (data: Record<string, unknown>) => Promise<InsertOneResult<T>>;
  findOneByEmail: (email: string) => Promise<WithId<T> | null>;
}

export type { UserRepository };

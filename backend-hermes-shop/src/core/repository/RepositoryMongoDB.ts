import type Joi from 'joi';
import type { Document, Filter, MatchKeysAndValues, WithId } from 'mongodb';
import { ObjectId } from 'mongodb';
import type { ModelId } from '~/core/model/types';
import { getDB } from '~/core/mongodb';

type RepositoryOptions<T extends Document> = {
  invalidFields?: (keyof WithId<T>)[];
};

export abstract class RepositoryMongoDB<T extends Document> {
  protected collectionName: string;
  protected joiObjectSchema: Joi.ObjectSchema<T>;
  protected options: RepositoryOptions<T> | undefined;

  constructor(collectionName: string, joiObjectSchema: Joi.ObjectSchema<T>, options?: RepositoryOptions<T>) {
    this.collectionName = collectionName;
    this.joiObjectSchema = joiObjectSchema;
    this.options = options;
  }

  get collection() {
    return getDB().collection<T>(this.collectionName);
  }

  public findOneById(id: ModelId): Promise<WithId<T> | null> {
    return this.collection.findOne({ _id: new ObjectId(id) } as Filter<T>);
  }

  public async findOneAndUpdateById(id: ModelId, updateData: Record<string, unknown>): Promise<WithId<T> | null> {
    this.removeInvalidFields(updateData);
    return this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) as Filter<T> },
      { $set: updateData as MatchKeysAndValues<T> },
      { returnDocument: 'after' },
    );
  }

  protected validateBeforeCreate(data: Record<string, unknown>): Promise<T> {
    return this.joiObjectSchema.validateAsync(data, { abortEarly: false });
  }

  protected removeInvalidFields(data: Record<string, unknown>): void {
    if (!this.options?.invalidFields) return;

    Object.keys(data).forEach((key) => {
      if (this.options?.invalidFields?.includes(key)) delete data[key];
    });
  }
}

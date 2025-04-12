import type Joi from 'joi';
import type { Collection, Document, Filter, WithId } from 'mongodb';
import { ObjectId } from 'mongodb';
import { getDB } from '~/core/mongodb';
import type { ModelId } from '~/models/model';
import type { RepositoryFindOneBasic } from '~/repositories/repositoryFindOneBasic';

export type RepositoryOptions<T extends Document> = {
  invalidFields?: (keyof WithId<T>)[];
};

export abstract class RepositoryMongoDB<T extends Document> implements RepositoryFindOneBasic<T> {
  protected name: string;
  protected validSchema: Joi.ObjectSchema<T>;
  protected options: RepositoryOptions<T> | undefined;

  constructor(name: string, schema: Joi.ObjectSchema<T>, options?: RepositoryOptions<T>) {
    this.name = name;
    this.options = options;
    this.validSchema = schema;
  }

  public get collection(): Collection<T> {
    return getDB().collection<T>(this.name);
  }

  public findOneById(id: ModelId): Promise<WithId<T> | null> {
    return this.collection.findOne({ _id: new ObjectId(id) } as Filter<T>);
  }

  protected validateBeforeCreate(data: Record<string, unknown>): Promise<T> {
    return this.validSchema.validateAsync(data, { abortEarly: false });
  }

  protected removeInvalidFields(data: Record<string, unknown>) {
    if (!this.options?.invalidFields) return;

    Object.keys(data).forEach((key) => {
      if (this.options?.invalidFields?.includes(key)) delete data[key];
    });
  }
}

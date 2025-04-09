import type Joi from 'joi';
import type { Collection, Document } from 'mongodb';
import { getDB } from '~/core/mongodb';

export type RepositoryOptions<T extends Document> = {
  invalidFields?: (keyof T | '_id')[];
};

export abstract class RepositoryMongoDB<T extends Document> {
  protected name: string;
  protected validSchema: Joi.ObjectSchema<T>;
  protected options: RepositoryOptions<T> | undefined;

  constructor(name: string, schema: Joi.ObjectSchema<T>, options?: RepositoryOptions<T>) {
    this.name = name;
    this.options = options;
    this.validSchema = schema;
  }

  public get collectionName(): Collection<T> {
    return getDB().collection<T>(this.name);
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

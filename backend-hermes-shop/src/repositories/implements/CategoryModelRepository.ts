import Joi from 'joi';
import type { InsertOneResult, WithId } from 'mongodb';
import { ObjectId } from 'mongodb';
import { COLLECTION_NAME_KEYS } from '~/configs/collectionNameKeys';
import { StatusCodes } from '~/configs/statusCode';
import getBaseValidSchema from '~/helpers/getBaseValidSchema';
import NextError from '~/helpers/nextError';
import type { CategoryModel, CategoryModelProperties } from '~/models/categoryModel';
import type { ModelId } from '~/models/model';
import { RepositoryMongoDB } from '~/repositories/RepositoryMongoDB';
import type { categoryRepository } from '~/repositories/categoryRepository';

const baseSkuSchema = getBaseValidSchema<CategoryModel>();

const SCHEMA = baseSkuSchema.keys({
  name: Joi.string().required().trim().strict(),
  slugify: Joi.string().required().trim().strict(),
});
const INVALID_FIELDS: CategoryModelProperties[] = ['_id', '_destroy', 'createdAt'];

export class CategoryModelRepository
  extends RepositoryMongoDB<CategoryModel>
  implements categoryRepository<CategoryModel>
{
  constructor() {
    super(COLLECTION_NAME_KEYS.CATEGORIES, SCHEMA, { invalidFields: INVALID_FIELDS });
  }

  public async findOneById(categoryId: ModelId): Promise<WithId<CategoryModel> | null> {
    return this.collection.findOne({ _id: new ObjectId(categoryId) });
  }

  public async findOneByName(name: string): Promise<WithId<CategoryModel> | null> {
    return this.collection.findOne({ name });
  }

  public async findOneBySlugify(slugify: string): Promise<WithId<CategoryModel> | null> {
    return this.collection.findOne({ slugify });
  }

  public async create(data: Record<string, unknown>): Promise<InsertOneResult<CategoryModel>> {
    let validData: CategoryModel | null = null;
    try {
      validData = await this.validateBeforeCreate(data);
    } catch (error) {
      throw new NextError(StatusCodes.UNPROCESSABLE_ENTITY, error);
    }

    return this.collection.insertOne({ ...validData });
  }

  public async update(categoryId: ModelId, updateData: Record<string, unknown>): Promise<WithId<CategoryModel> | null> {
    this.removeInvalidFields(updateData);

    return this.collection.findOneAndUpdate(
      { _id: new ObjectId(categoryId) },
      { $set: updateData },
      { returnDocument: 'after' },
    );
  }
}

import Joi from 'joi';
import type { InsertOneResult, WithId } from 'mongodb';
import { COLLECTION_NAME_KEYS } from '~/configs/keys';
import { StatusCodes } from '~/configs/statusCodes';
import { RepositoryMongoDB } from '~/core/repository/RepositoryMongoDB';
import getBaseValidSchema from '~/helpers/getBaseValidSchema';
import NextError from '~/helpers/nextError';
import type { CategoryModel, CategoryModelProperties } from '~/models/categoryModel';
import type { CategoryRepository } from '~/repositories/categoryRepository';

const baseCategorySchema = getBaseValidSchema<CategoryModel>();

const SCHEMA = baseCategorySchema.keys({
  name: Joi.string().required().trim().strict(),
  slugify: Joi.string().required().trim().strict(),
});
const INVALID_FIELDS: CategoryModelProperties[] = ['_id', 'createdAt'];

export class CategoryModelRepository
  extends RepositoryMongoDB<CategoryModel>
  implements CategoryRepository<CategoryModel>
{
  constructor() {
    super(COLLECTION_NAME_KEYS.CATEGORIES, SCHEMA, { invalidFields: INVALID_FIELDS });
  }

  public async findOneByName(name: string): Promise<WithId<CategoryModel> | null> {
    return this.collection.findOne({ name });
  }

  public async findOneBySlugify(slugify: string): Promise<WithId<CategoryModel> | null> {
    return this.collection.findOne({ slugify });
  }

  public async insertOne(data: Record<string, unknown>): Promise<InsertOneResult<CategoryModel>> {
    let validatedData: CategoryModel | null = null;
    try {
      validatedData = await this.validateBeforeCreate(data);
    } catch (error) {
      throw new NextError(StatusCodes.UNPROCESSABLE_ENTITY, error);
    }
    return this.collection.insertOne(validatedData);
  }
}

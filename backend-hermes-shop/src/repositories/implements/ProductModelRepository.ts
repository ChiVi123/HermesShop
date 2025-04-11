import Joi from 'joi';
import type { Document, InsertOneResult, WithId } from 'mongodb';
import { ObjectId } from 'mongodb';
import { StatusCodes } from '~/configs/statusCode';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/configs/validates';
import getBaseValidSchema from '~/helpers/getBaseValidSchema';
import NextError from '~/helpers/nextError';
import type { ModelId } from '~/models/model';
import type { ProductAttr, ProductModel, ProductModelProperties } from '~/models/productModel';
import { RepositoryMongoDB } from '~/repositories/RepositoryMongoDB';
import type { ProductRepository } from '~/repositories/productRepository';

const baseSchema = getBaseValidSchema<ProductModel>();

const COLLECTION_NAME = 'products';
const SCHEMA = baseSchema.keys({
  name: Joi.string().required().trim().strict(),
  slugify: Joi.string().required().trim().strict(),
  shortDescription: Joi.string().required().trim().strict(),
  gender: Joi.string().trim().strict().default('Men'),
  rating: Joi.number().positive().default(0),
  attrs: Joi.array()
    .items(
      Joi.object<ProductAttr>({
        key: Joi.string().required().trim().strict(),
        type: Joi.string().required().trim().strict(),
      }),
    )
    .default([]),
  skuIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
});
const INVALID_FIELDS: ProductModelProperties[] = ['_id', '_destroy', 'createdAt'];

export class ProductModelRepository extends RepositoryMongoDB<ProductModel> implements ProductRepository<ProductModel> {
  constructor() {
    super(COLLECTION_NAME, SCHEMA, { invalidFields: INVALID_FIELDS });
  }

  public async create(data: Record<string, unknown>): Promise<InsertOneResult<ProductModel>> {
    try {
      const validData = await this.validateBeforeCreate(data);
      return this.collectionName.insertOne(validData);
    } catch (error) {
      throw new NextError(StatusCodes.UNPROCESSABLE_ENTITY, error);
    }
  }

  public async update(id: string, updateData: Record<string, unknown>): Promise<WithId<ProductModel> | null> {
    this.removeInvalidFields(updateData);

    return this.collectionName.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' },
    );
  }

  public async pushSkuIds(id: ModelId, skuIds: ObjectId[]): Promise<WithId<ProductModel> | null> {
    return this.collectionName.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $push: { skuIds: { $each: skuIds } } },
      { returnDocument: 'after' },
    );
  }

  public async pullSkuIds(id: ModelId, skuIds: ObjectId[]): Promise<WithId<ProductModel> | null> {
    return this.collectionName.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $pull: { skuIds: { $each: skuIds } } },
      { returnDocument: 'after' },
    );
  }

  public findOneById(id: ModelId): Promise<WithId<ProductModel> | null> {
    return this.collectionName.findOne({ _id: new ObjectId(id) });
  }

  public findOneByName(name: string): Promise<WithId<ProductModel> | null> {
    return this.collectionName.findOne({ name });
  }

  public async getDetailsBySlugify(slugify: string): Promise<Document | null> {
    const result = await this.collectionName
      .aggregate([
        { $match: { slugify } },
        {
          $lookup: {
            from: 'skus',
            localField: '_id',
            foreignField: 'productId',
            as: 'skus',
          },
        },
      ])
      .toArray();

    return result[0] ?? null;
  }

  public destroyById(id: ModelId): Promise<WithId<ProductModel> | null> {
    return this.collectionName.findOneAndDelete({ _id: new ObjectId(id) });
  }
}

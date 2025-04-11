import Joi from 'joi';
import type { Document, InsertOneResult, WithId } from 'mongodb';
import { ObjectId } from 'mongodb';
import { COLLECTION_NAME_KEYS } from '~/configs/collectionNameKeys';
import { StatusCodes } from '~/configs/statusCode';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/configs/validates';
import getBaseValidSchema from '~/helpers/getBaseValidSchema';
import NextError from '~/helpers/nextError';
import type { ModelId } from '~/models/model';
import type { ProductAttr, ProductModel, ProductModelProperties } from '~/models/productModel';
import { RepositoryMongoDB } from '~/repositories/RepositoryMongoDB';
import type { ProductRepository } from '~/repositories/productRepository';

const baseSchema = getBaseValidSchema<ProductModel>();

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
    super(COLLECTION_NAME_KEYS.PRODUCTS, SCHEMA, { invalidFields: INVALID_FIELDS });
  }

  public async create(data: Record<string, unknown>): Promise<InsertOneResult<ProductModel>> {
    try {
      const validData = await this.validateBeforeCreate(data);
      return this.collection.insertOne(validData);
    } catch (error) {
      throw new NextError(StatusCodes.UNPROCESSABLE_ENTITY, error);
    }
  }

  public async update(id: string, updateData: Record<string, unknown>): Promise<WithId<ProductModel> | null> {
    this.removeInvalidFields(updateData);

    return this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' },
    );
  }

  public async pushSkuIds(productId: ModelId, skuIds: ModelId[]): Promise<WithId<ProductModel> | null> {
    return this.collection.findOneAndUpdate(
      { _id: new ObjectId(productId) },
      { $push: { skuIds: { $each: skuIds } } },
      { returnDocument: 'after' },
    );
  }

  public async pullSkuIds(productId: ModelId, skuIds: ObjectId[]): Promise<WithId<ProductModel> | null> {
    return this.collection.findOneAndUpdate(
      { _id: new ObjectId(productId) },
      { $pull: { skuIds: { $each: skuIds } } },
      { returnDocument: 'after' },
    );
  }

  public findOneById(productId: ModelId): Promise<WithId<ProductModel> | null> {
    return this.collection.findOne({ _id: new ObjectId(productId) });
  }

  public findOneByName(name: string): Promise<WithId<ProductModel> | null> {
    return this.collection.findOne({ name });
  }

  public async getDetailsBySlugify(slugify: string): Promise<Document | null> {
    const result = await this.collection
      .aggregate([
        { $match: { slugify } },
        {
          $lookup: {
            from: COLLECTION_NAME_KEYS.SKUS,
            localField: '_id',
            foreignField: 'productId',
            as: 'skus',
          },
        },
      ])
      .toArray();

    return result[0] ?? null;
  }

  public destroyById(productId: ModelId): Promise<WithId<ProductModel> | null> {
    return this.collection.findOneAndDelete({ _id: new ObjectId(productId) });
  }
}

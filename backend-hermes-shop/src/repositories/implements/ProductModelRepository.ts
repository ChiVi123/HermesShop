import Joi from 'joi';
import type { Document, InsertOneResult, WithId } from 'mongodb';
import { ObjectId } from 'mongodb';
import { COLLECTION_NAME_KEYS, GENDER_KEYS, OPTION_TYPE_KEYS, STATUS_PRODUCT_KEYS } from '~/configs/keys';
import { StatusCodes } from '~/configs/statusCodes';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/configs/validates';
import type { ModelId } from '~/core/model/types';
import { RepositoryMongoDB } from '~/core/repository/RepositoryMongoDB';
import getBaseValidSchema from '~/helpers/getBaseValidSchema';
import NextError from '~/helpers/nextError';
import type { ProductAttr, ProductModel, ProductModelProperties, ProductOption } from '~/models/productModel';
import type { ProductRepository } from '~/repositories/productRepository';

const baseSchema = getBaseValidSchema<ProductModel>();

const SCHEMA = baseSchema.keys({
  name: Joi.string().required().trim().strict(),
  slugify: Joi.string().required().trim().strict(),
  // shortDescription: Joi.string().trim().strict(),
  shortDescription: Joi.string().trim().strict().allow(''),
  categoryId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  gender: Joi.string()
    .valid(...Object.values(GENDER_KEYS))
    .default(GENDER_KEYS.MEN),
  rating: Joi.number().positive().default(0),
  attrs: Joi.array()
    .items(
      Joi.object<ProductAttr>({
        key: Joi.string().required().trim().strict(),
        value: Joi.string().required().trim().strict(),
      }),
    )
    .default([]),
  options: Joi.array()
    .items(
      Joi.object<ProductOption>({
        key: Joi.string().required().trim().strict(),
        type: Joi.string()
          .valid(...Object.values(OPTION_TYPE_KEYS))
          .default(OPTION_TYPE_KEYS.SELECT),
      }),
    )
    .default([]),
  skuIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  _status: Joi.string()
    .valid(...Object.values(STATUS_PRODUCT_KEYS))
    .default(STATUS_PRODUCT_KEYS.RAW),
});
const INVALID_FIELDS: ProductModelProperties[] = ['_id', 'createdAt'];

export class ProductModelRepository extends RepositoryMongoDB<ProductModel> implements ProductRepository<ProductModel> {
  constructor() {
    super(COLLECTION_NAME_KEYS.PRODUCTS, SCHEMA, { invalidFields: INVALID_FIELDS });
  }

  public findAll() {
    return this.collection
      .aggregate([
        {
          $lookup: {
            from: COLLECTION_NAME_KEYS.SKUS,
            localField: '_id',
            foreignField: 'productId',
            as: 'skus',
          },
        },
        {
          $lookup: {
            from: COLLECTION_NAME_KEYS.CATEGORIES,
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            shortDescription: 1,
            gender: 1,
            slugify: 1,
            category: {
              $arrayElemAt: ['$category', 0],
            },
            sku: {
              $arrayElemAt: ['$skus', 0],
            },
          },
        },
      ])
      .toArray();
  }

  public findOneByName(name: string): Promise<WithId<ProductModel> | null> {
    return this.collection.findOne({ name });
  }

  public findOneBySlugify(slugify: string): Promise<WithId<ProductModel> | null> {
    return this.collection.findOne({ slugify });
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
        {
          $lookup: {
            from: COLLECTION_NAME_KEYS.CATEGORIES,
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
          },
        },
      ])
      .toArray();

    return result[0] ?? null;
  }

  public async insertOne(data: Record<string, unknown>): Promise<InsertOneResult<ProductModel>> {
    let validatedData: ProductModel | null = null;
    try {
      validatedData = await this.validateBeforeCreate(data);
    } catch (error) {
      throw new NextError(StatusCodes.UNPROCESSABLE_ENTITY, error);
    }
    return this.collection.insertOne({ ...validatedData, categoryId: new ObjectId(validatedData.categoryId) });
  }

  public async pushSkuIds(productId: ModelId, skuIds: ObjectId[]): Promise<WithId<ProductModel> | null> {
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

  public destroyById(productId: ModelId): Promise<WithId<ProductModel> | null> {
    return this.collection.findOneAndDelete({ _id: new ObjectId(productId) });
  }
}

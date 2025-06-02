import Joi from 'joi';
import type { Document, InsertOneResult, WithId } from 'mongodb';
import { ObjectId } from 'mongodb';
import { COLLECTION_NAME_KEYS, GENDER_KEYS, STATUS_PRODUCT_KEYS } from '~/configs/keys';
import { StatusCodes } from '~/configs/statusCodes';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/configs/validates';
import type { ModelId } from '~/core/model/types';
import { RepositoryMongoDB } from '~/core/repository/RepositoryMongoDB';
import getBaseValidSchema from '~/helpers/getBaseValidSchema';
import NextError from '~/helpers/nextError';
import type { ProductAttr, ProductModel, ProductModelProperties } from '~/models/productModel';
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
  _status: Joi.string()
    .valid(...Object.values(STATUS_PRODUCT_KEYS))
    .default(STATUS_PRODUCT_KEYS.RAW),
});
const INVALID_FIELDS: ProductModelProperties[] = ['_id', 'createdAt'];

// AGGREGATE
const AGGREGATE_PRODUCT_DEFAULT = [
  {
    $lookup: {
      from: COLLECTION_NAME_KEYS.CATEGORIES,
      localField: 'categoryId',
      foreignField: '_id',
      as: 'category',
    },
  },
  {
    $lookup: {
      from: COLLECTION_NAME_KEYS.PRODUCT_VARIANTS,
      localField: '_id',
      foreignField: 'productId',
      as: 'variants',
    },
  },
  { $unwind: '$variants' },
  {
    $lookup: {
      from: COLLECTION_NAME_KEYS.IMAGES,
      let: { imageIds: '$variants.imageIds' },
      pipeline: [
        { $match: { $expr: { $in: ['$_id', '$$imageIds'] } } },
        {
          $addFields: {
            sortIndex: { $indexOfArray: ['$$imageIds', '$_id'] },
          },
        },
        { $sort: { sortIndex: 1 } },
        { $project: { sortIndex: 0 } },
      ],
      as: 'variants.images',
    },
  },
];
const AGGREGATE_PRODUCT_GROUP = {
  _id: '$_id',
  name: { $first: '$name' },
  slugify: { $first: '$slugify' },
  gender: { $first: '$gender' },
  rating: { $first: '$rating' },
  category: { $first: '$category' },
  variants: { $push: '$variants' },
  createdAt: { $first: '$createdAt' },
  updatedAt: { $first: '$updatedAt' },
};
const AGGREGATE_SPECIFY_PRODUCT_FIELDS = {
  _id: 1,
  name: 1,
  slugify: 1,
  gender: 1,
  rating: 1,
  category: {
    _id: 1,
    name: 1,
    slugify: 1,
  },
  createdAt: 1,
  updatedAt: 1,
};
const AGGREGATE_SPECIFY_PRODUCT_VARIANT_FIELDS = {
  _id: 1,
  color: 1,
  productId: 1,
  discountPrice: 1,
  price: 1,
  sizes: 1,
  images: {
    _id: 1,
    publicId: 1,
    url: 1,
    width: 1,
    height: 1,
  },
};
const LIMIT_ITEM_PER_PAGE = 12;
const FIRST_ELEMENT_INDEX = 0;

export class ProductModelRepository extends RepositoryMongoDB<ProductModel> implements ProductRepository<ProductModel> {
  constructor() {
    super(COLLECTION_NAME_KEYS.PRODUCTS, SCHEMA, { invalidFields: INVALID_FIELDS });
  }

  // TODO: get items by params (search api)
  public findAll() {
    return this.collection
      .aggregate([
        ...AGGREGATE_PRODUCT_DEFAULT,
        { $group: AGGREGATE_PRODUCT_GROUP },
        {
          $addFields: {
            category: { $arrayElemAt: ['$category', FIRST_ELEMENT_INDEX] },
            variant: { $arrayElemAt: ['$variants', FIRST_ELEMENT_INDEX] },
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: LIMIT_ITEM_PER_PAGE },
        {
          $project: {
            ...AGGREGATE_SPECIFY_PRODUCT_FIELDS,
            variant: AGGREGATE_SPECIFY_PRODUCT_VARIANT_FIELDS,
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
        ...AGGREGATE_PRODUCT_DEFAULT,
        { $match: { slugify } },
        {
          $group: {
            ...AGGREGATE_PRODUCT_GROUP,
            shortDescription: { $first: '$shortDescription' },
            attrs: { $first: '$attrs' },
          },
        },
        {
          $addFields: {
            category: { $arrayElemAt: ['$category', FIRST_ELEMENT_INDEX] },
          },
        },
        {
          $project: {
            ...AGGREGATE_SPECIFY_PRODUCT_FIELDS,
            variants: AGGREGATE_SPECIFY_PRODUCT_VARIANT_FIELDS,
            shortDescription: 1,
            attrs: 1,
          },
        },
      ])
      .toArray();

    return result[FIRST_ELEMENT_INDEX] ?? null;
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

  public destroyById(productId: ModelId): Promise<WithId<ProductModel> | null> {
    return this.collection.findOneAndDelete({ _id: new ObjectId(productId) });
  }
}

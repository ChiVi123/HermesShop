import Joi from 'joi';
import type { InsertManyResult, WithId } from 'mongodb';
import { ObjectId } from 'mongodb';
import { COLLECTION_NAME_KEYS } from '~/configs/keys';
import { StatusCodes } from '~/configs/statusCodes';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/configs/validates';
import type { ModelId } from '~/core/model/types';
import { RepositoryMongoDB } from '~/core/repository/RepositoryMongoDB';
import getBaseValidSchema from '~/helpers/getBaseValidSchema';
import NextError from '~/helpers/nextError';
import type { Image } from '~/models/imageModel';
import type { SkuModel, SkuModelProperties, SkuSpec } from '~/models/productModel';
import type { SkuRepository } from '~/repositories/skuRepository';

const baseSkuSchema = getBaseValidSchema<SkuModel>();

const SCHEMA = baseSkuSchema.keys({
  productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  // name: Joi.string().required().trim().strict(),
  // slugify: Joi.string().required().trim().strict(),
  price: Joi.number().required().min(0),
  discountPrice: Joi.number().default(Joi.ref('price', { adjust: (value) => value })),
  specs: Joi.array()
    .items(
      Joi.object<SkuSpec>({
        key: Joi.string().required().trim().strict(),
        value: Joi.string().required().trim().strict(),
      }),
    )
    .default([]),
  images: Joi.array().items(
    Joi.object<Image>({
      bytes: Joi.number(),
      createdAt: Joi.number(),
      height: Joi.number(),
      publicId: Joi.string(),
      url: Joi.string(),
      width: Joi.number(),
    }),
  ),
  stock: Joi.number(),
});
const INVALID_FIELDS: SkuModelProperties[] = ['_id', 'createdAt'];

export class SkuModelRepository extends RepositoryMongoDB<SkuModel> implements SkuRepository<SkuModel> {
  constructor() {
    super(COLLECTION_NAME_KEYS.SKUS, SCHEMA, { invalidFields: INVALID_FIELDS });
  }

  public async createMany(dataList: Record<string, unknown>[]): Promise<InsertManyResult<SkuModel>> {
    const validDataList: SkuModel[] = [];
    try {
      for (const data of dataList) {
        const validData = await this.validateBeforeCreate(data);
        validDataList.push({ ...validData, productId: new ObjectId(validData.productId) });
      }
    } catch (error) {
      throw new NextError(StatusCodes.UNPROCESSABLE_ENTITY, error);
    }

    return this.collection.insertMany(validDataList);
  }

  public async findOneByName(name: string): Promise<WithId<SkuModel> | null> {
    return this.collection.findOne({ name });
  }

  public async findOneBySlugify(slugify: string): Promise<WithId<SkuModel> | null> {
    return this.collection.findOne({ slugify });
  }

  public async destroyById(skuId: ModelId): Promise<WithId<SkuModel> | null> {
    return this.collection.findOneAndDelete({ _id: new ObjectId(skuId) });
  }
}

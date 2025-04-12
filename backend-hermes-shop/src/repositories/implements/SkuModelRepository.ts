import Joi from 'joi';
import type { InsertManyResult, InsertOneResult, WithId } from 'mongodb';
import { ObjectId } from 'mongodb';
import { COLLECTION_NAME_KEYS } from '~/configs/collectionNameKeys';
import { StatusCodes } from '~/configs/statusCode';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/configs/validates';
import getBaseValidSchema from '~/helpers/getBaseValidSchema';
import NextError from '~/helpers/nextError';
import type { ModelId } from '~/models/model';
import type { SkuAttr, SkuModel, SkuModelProperties } from '~/models/productModel';
import { RepositoryMongoDB } from '~/repositories/RepositoryMongoDB';
import type { SkuRepository } from '~/repositories/skuRepository';

const baseSkuSchema = getBaseValidSchema<SkuModel>();

const SCHEMA = baseSkuSchema.keys({
  productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  name: Joi.string().required().trim().strict(),
  slugify: Joi.string().required().trim().strict(),
  price: Joi.number().required().min(0),
  discountPrice: Joi.number().default(Joi.ref('price', { adjust: (value) => value })),
  attrs: Joi.array()
    .items(
      Joi.object<SkuAttr>({
        key: Joi.string().required().trim().strict(),
        value: Joi.string().required().trim().strict(),
      }),
    )
    .default([]),
});
const INVALID_FIELDS: SkuModelProperties[] = ['_id', '_destroy', 'createdAt'];

export class SkuModelRepository extends RepositoryMongoDB<SkuModel> implements SkuRepository<SkuModel> {
  constructor() {
    super(COLLECTION_NAME_KEYS.SKUS, SCHEMA, { invalidFields: INVALID_FIELDS });
  }

  public async create(data: Record<string, unknown>): Promise<InsertOneResult<SkuModel>> {
    let validData: SkuModel | null = null;
    try {
      validData = await this.validateBeforeCreate(data);
    } catch (error) {
      throw new NextError(StatusCodes.UNPROCESSABLE_ENTITY, error);
    }
    return this.collection.insertOne({ ...validData, productId: new ObjectId(validData.productId) });
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

  public async update(skuId: string, updateData: Record<string, unknown>): Promise<WithId<SkuModel> | null> {
    this.removeInvalidFields(updateData);
    return this.collection.findOneAndUpdate(
      { _id: new ObjectId(skuId) },
      { $set: updateData },
      { returnDocument: 'after' },
    );
  }

  public async findOneBySlugify(slugify: string): Promise<WithId<SkuModel> | null> {
    return this.collection.findOne({ slugify });
  }

  public async destroyById(skuId: ModelId): Promise<WithId<SkuModel> | null> {
    return this.collection.findOneAndDelete({ _id: new ObjectId(skuId) });
  }
}

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
import type { ProductSize, ProductVariantModel, ProductVariantModelProperties } from '~/models/productModel';
import type { ProductVariantRepository } from '~/repositories/productVariantRepository';

const baseProductVariantSchema = getBaseValidSchema<ProductVariantModel>();

const SCHEMA = baseProductVariantSchema.keys({
  productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  // name: Joi.string().required().trim().strict(),
  // slugify: Joi.string().required().trim().strict(),
  color: Joi.string().required().trim().strict(),
  price: Joi.number().required().min(0),
  discountPrice: Joi.number().default(Joi.ref('price', { adjust: (value) => value })),
  sizes: Joi.array()
    .items(
      Joi.object<ProductSize>({
        size: Joi.string().required().trim().strict(),
        stock: Joi.number().required().positive().allow(0),
      }),
    )
    .default([]),
  imageIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
});
const INVALID_FIELDS: ProductVariantModelProperties[] = ['_id', 'createdAt'];

export class ProductVariantModelRepository
  extends RepositoryMongoDB<ProductVariantModel>
  implements ProductVariantRepository<ProductVariantModel>
{
  constructor() {
    super(COLLECTION_NAME_KEYS.PRODUCT_VARIANTS, SCHEMA, { invalidFields: INVALID_FIELDS });
  }

  public async createMany(dataList: Record<string, unknown>[]): Promise<InsertManyResult<ProductVariantModel>> {
    const validDataList: ProductVariantModel[] = [];
    try {
      for (const data of dataList) {
        const validData = await this.validateBeforeCreate(data);
        validDataList.push({
          ...validData,
          productId: new ObjectId(validData.productId),
          imageIds: validData.imageIds.map((item) => new ObjectId(item)),
        });
      }
    } catch (error) {
      throw new NextError(StatusCodes.UNPROCESSABLE_ENTITY, error);
    }

    return this.collection.insertMany(validDataList);
  }

  public async findOneByName(name: string): Promise<WithId<ProductVariantModel> | null> {
    return this.collection.findOne({ name });
  }

  public async findOneBySlugify(slugify: string): Promise<WithId<ProductVariantModel> | null> {
    return this.collection.findOne({ slugify });
  }

  public async destroyById(productVariantId: ModelId): Promise<WithId<ProductVariantModel> | null> {
    return this.collection.findOneAndDelete({ _id: new ObjectId(productVariantId) });
  }
}

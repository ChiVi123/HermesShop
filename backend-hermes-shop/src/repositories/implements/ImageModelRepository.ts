import Joi from 'joi';
import type { InsertManyResult, InsertOneResult, WithId } from 'mongodb';
import { COLLECTION_NAME_KEYS } from '~/configs/keys';
import { StatusCodes } from '~/configs/statusCodes';
import { RepositoryMongoDB } from '~/core/repository/RepositoryMongoDB';
import getBaseValidSchema from '~/helpers/getBaseValidSchema';
import NextError from '~/helpers/nextError';
import type { ImageModel, ImageModelProperties } from '~/models/imageModel';
import type { ImageRepository } from '../imageRepository';

const baseSchema = getBaseValidSchema<ImageModel>();

const SCHEMA = baseSchema.keys({
  publicId: Joi.string().required().trim().strict(),
  url: Joi.string().required().trim().strict(),
  width: Joi.number().positive().allow(0),
  height: Joi.number().positive().allow(0),
  bytes: Joi.number().positive().allow(0),
});
const INVALID_FIELDS: ImageModelProperties[] = ['_id', 'createdAt', '_hidden'];

export class ImageModelRepository extends RepositoryMongoDB<ImageModel> implements ImageRepository<ImageModel> {
  constructor() {
    super(COLLECTION_NAME_KEYS.IMAGES, SCHEMA, { invalidFields: INVALID_FIELDS });
  }

  public async createIndex(): Promise<void> {
    const result = await this.collection.createIndex({ publicId: 1 }, { unique: true });
    logging.info(`[${ImageModelRepository.name}:createIndex]`, result);
  }

  public findOneByPublicId(publicId: string): Promise<WithId<ImageModel> | null> {
    return this.collection.findOne({ publicId });
  }

  public async insertOne(data: Record<string, unknown>): Promise<InsertOneResult<ImageModel>> {
    let validatedData: ImageModel | null = null;
    try {
      validatedData = await this.validateBeforeCreate(data);
    } catch (error) {
      throw new NextError(StatusCodes.UNPROCESSABLE_ENTITY, error);
    }
    return this.collection.insertOne(validatedData);
  }

  public async createMany(dataList: Record<string, unknown>[]): Promise<InsertManyResult<ImageModel>> {
    const validDataList: ImageModel[] = [];
    try {
      for (const data of dataList) {
        const validData = await this.validateBeforeCreate(data);
        validDataList.push({ ...validData });
      }
    } catch (error) {
      throw new NextError(StatusCodes.UNPROCESSABLE_ENTITY, error);
    }

    return this.collection.insertMany(validDataList, { ordered: false });
  }
}

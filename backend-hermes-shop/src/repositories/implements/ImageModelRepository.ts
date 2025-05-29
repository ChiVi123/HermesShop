import Joi from 'joi';
import type { InsertOneResult, WithId } from 'mongodb';
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
}

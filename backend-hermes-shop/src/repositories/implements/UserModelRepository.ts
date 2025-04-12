import Joi from 'joi';
import { COLLECTION_NAME_KEYS } from '~/configs/collectionNameKeys';
import { ROLE_NAMES } from '~/configs/role';
import { StatusCodes } from '~/configs/statusCode';
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/configs/validates';
import getBaseValidSchema from '~/helpers/getBaseValidSchema';
import NextError from '~/helpers/nextError';
import type { UserModel, UserModelProperties } from '~/models/userModel';
import { RepositoryMongoDB } from '~/repositories/RepositoryMongoDB';
import type { UserRepository } from '~/repositories/userRepository';

const baseSchema = getBaseValidSchema<UserModel>();

const SCHEMA = baseSchema.keys({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
  role: Joi.string()
    .valid(...Object.values(ROLE_NAMES))
    .default(ROLE_NAMES.USER),
});
const INVALID_FIELDS: UserModelProperties[] = ['_id', 'createdAt', 'email', 'username'];

export class UserModelRepository extends RepositoryMongoDB<UserModel> implements UserRepository<UserModel> {
  constructor() {
    super(COLLECTION_NAME_KEYS.USERS, SCHEMA, { invalidFields: INVALID_FIELDS });
  }

  public async create(data: Record<string, unknown>) {
    let validData: UserModel | null = null;
    try {
      validData = await this.validateBeforeCreate(data);
    } catch (error) {
      throw new NextError(StatusCodes.UNPROCESSABLE_ENTITY, error);
    }
    return this.collection.insertOne(validData);
  }

  public findOneByEmail(email: string) {
    return this.collection.findOne({ email });
  }
}

import Joi from 'joi';
import type { InsertOneResult } from 'mongodb';
import { COLLECTION_NAME_KEYS } from '~/configs/keys';
import { ROLE_NAMES } from '~/configs/role';
import { StatusCodes } from '~/configs/statusCodes';
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/configs/validates';
import { RepositoryMongoDB } from '~/core/repository/RepositoryMongoDB';
import getBaseValidSchema from '~/helpers/getBaseValidSchema';
import NextError from '~/helpers/nextError';
import type { UserModel, UserModelProperties } from '~/models/userModel';
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

  public findOneByEmail(email: string) {
    return this.collection.findOne({ email });
  }

  public async insertOne(data: Record<string, unknown>): Promise<InsertOneResult<UserModel>> {
    let validatedData: UserModel | null = null;
    try {
      validatedData = await this.validateBeforeCreate(data);
    } catch (error) {
      throw new NextError(StatusCodes.UNPROCESSABLE_ENTITY, error);
    }
    return this.collection.insertOne(validatedData);
  }
}

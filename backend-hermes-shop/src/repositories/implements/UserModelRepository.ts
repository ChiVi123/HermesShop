import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { ROLE_NAMES } from '~/configs/role';
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/configs/validates';
import getBaseValidSchema from '~/helpers/getBaseValidSchema';
import type { UserModel, UserModelProperties } from '~/models/userModel';
import { RepositoryMongoDB } from '~/repositories/RepositoryMongoDB';
import type { UserRepository } from '~/repositories/userRepository';

const baseSchema = getBaseValidSchema<UserModel>();

const COLLECTION_NAME = 'users';
const SCHEMA = baseSchema.keys({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
  role: Joi.string()
    .valid(...Object.values(ROLE_NAMES))
    .default(ROLE_NAMES.USER),
});
const INVALID_FIELDS: UserModelProperties[] = ['_id', '_destroy', 'createdAt', 'email', 'username'];

export class UserModelRepository extends RepositoryMongoDB<UserModel> implements UserRepository<UserModel> {
  constructor() {
    super(COLLECTION_NAME, SCHEMA, { invalidFields: INVALID_FIELDS });
  }

  public async create(data: Record<string, unknown>) {
    const validData = await this.validateBeforeCreate(data);
    return this.collectionName.insertOne(validData);
  }

  public findOneById(id: string | ObjectId) {
    return this.collectionName.findOne({ _id: new ObjectId(id) });
  }

  public findOneByEmail(email: string) {
    return this.collectionName.findOne({ email });
  }
}

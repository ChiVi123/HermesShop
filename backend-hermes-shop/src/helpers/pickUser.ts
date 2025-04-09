import { pick } from 'lodash';
import type { WithId } from 'mongodb';
import type { UserModel, UserModelProperties, UserResponse } from '~/models/userModel';

const pickUser = (user: WithId<UserModel>): WithId<UserResponse> => {
  return pick<WithId<UserModel>, UserModelProperties>(user, [
    '_id',
    'displayName',
    'email',
    'username',
    'createdAt',
    'updatedAt',
  ]);
};

export default pickUser;

import type { WithId } from 'mongodb';
import type { RoleName } from '~/configs/role';
import type { Model, ModelResponse } from '~/core/model/types';

export interface UserModel extends Model {
  email: string;
  username: string;
  displayName: string;
  password: string;
  role: RoleName;
}
export type UserResponse = Omit<UserModel, 'password'> & ModelResponse;
export type UserReqBody = {
  email: string;
  password: string;
};
export type UserModelProperties = keyof WithId<UserModel>;

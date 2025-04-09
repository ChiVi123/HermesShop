import type { WithId } from 'mongodb';
import type { RoleName } from '~/configs/role';
import type { Model, ModelResponse } from '~/models/model';

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
export type UserSetData = Omit<UserModel, 'createdAt' | 'updatedAt' | '_destroy'>;
export type UserModelProperties = keyof WithId<UserModel>;

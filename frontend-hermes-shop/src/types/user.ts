export type RoleName = 'ADMIN' | 'MODERATOR' | 'USER';

export interface User {
  _id: string;
  email: string;
  username: string;
  displayName: string;
  role: RoleName;
  createdAt: number;
  updatedAt: number | null;

  accessToken: string;
  refreshToken: string;
}

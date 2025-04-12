import type { ObjectId } from 'mongodb';

export interface Model {
  createdAt: number;
  updatedAt: number | null;
  _hidden: boolean;
}
export type ModelId = string | ObjectId;
export type ModelArrayId = string[] | ObjectId[];
export type ModelResponse = Omit<Model, '_hidden'>;

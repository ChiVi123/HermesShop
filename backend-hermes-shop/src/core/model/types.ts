import type { ObjectId } from 'mongodb';

export interface Model {
  createdAt: number;
  updatedAt: number;
  _hidden: boolean;
}

export type ModelId = string | ObjectId;
export type ModelIds = string[] | ObjectId[];
export type ModelResponse = Omit<Model, '_hidden'>;

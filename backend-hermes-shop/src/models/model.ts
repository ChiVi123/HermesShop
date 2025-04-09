export interface Model {
  createdAt: number;
  updatedAt: number | null;
  _destroy: boolean;
}

export type ModelResponse = Omit<Model, '_destroy'>;

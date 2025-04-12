import Joi from 'joi';
import type { Model } from '~/core/model/types';

const getBaseValidSchema = <T extends Model>(): Joi.ObjectSchema<T> => {
  return Joi.object<T>({
    createdAt: Joi.date().timestamp('javascript').default(Date.now()),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _hidden: Joi.boolean().default(false),
  });
};

export default getBaseValidSchema;

import Joi from 'joi';
import type { CategoryReqBody } from '~/models/categoryModel';

export const createAndUpdateCategoryValidate = Joi.object<CategoryReqBody>({
  name: Joi.string().required().trim().strict(),
});

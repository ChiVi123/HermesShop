import Joi from 'joi';
import { OPTION_TYPE_KEYS } from '~/configs/keys';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/configs/validates';
import type { ProductOption, ProductReqBody, ProductSpec } from '~/models/productModel';
import { skuValidate } from '~/validates/skuValidate';

const productAttrsSchema = Joi.object<ProductSpec>({
  key: Joi.string().required().trim().strict(),
  value: Joi.string().required().trim().strict(),
});
const productOptionsSchema = Joi.object<ProductOption>({
  key: Joi.string().required().trim().strict(),
  type: Joi.string()
    .valid(...Object.values(OPTION_TYPE_KEYS))
    .default(OPTION_TYPE_KEYS.SELECT),
});

export const createProductValidate = Joi.object<ProductReqBody>({
  name: Joi.string().required().trim().strict(),
  shortDescription: Joi.string().trim().strict(),
  categoryId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  attrs: Joi.array().items(productAttrsSchema).default([]),
  options: Joi.array().items(productOptionsSchema).default([]),
  skus: Joi.array().items(skuValidate).default([]),
});
export const productUpdateValidate = Joi.object<ProductReqBody>({
  name: Joi.string().required().trim().strict(),
  shortDescription: Joi.string().trim().strict(),
  categoryId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
});

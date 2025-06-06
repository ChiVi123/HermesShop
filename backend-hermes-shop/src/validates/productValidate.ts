import Joi from 'joi';
import { OPTION_TYPE_KEYS } from '~/configs/keys';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/configs/validates';
import type { ProductAttr, ProductOption, ProductReqBody } from '~/models/productModel';
import { productVariantValidate } from '~/validates/productVariantValidate';

const productAttrsSchema = Joi.object<ProductAttr>({
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
  variants: Joi.array().items(productVariantValidate).default([]),
});
export const productUpdateValidate = Joi.object<ProductReqBody>({
  name: Joi.string().required().trim().strict(),
  shortDescription: Joi.string().trim().strict(),
  categoryId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
});

import Joi from 'joi';
import type { ProductReqBody } from '~/models/productModel';
import { skuValidate } from '~/validates/skuValidate';

const productAttrsSchema = Joi.object({
  key: Joi.string().required().trim().strict(),
  type: Joi.string().required().trim().strict(),
});

export const createProductValidate = Joi.object<ProductReqBody>({
  name: Joi.string().required().trim().strict(),
  shortDescription: Joi.string().required().trim().strict(),
  attrs: Joi.array().items(productAttrsSchema).default([]),
  skus: Joi.array().items(skuValidate).default([]),
});
export const productUpdateValidate = Joi.object<ProductReqBody>({
  name: Joi.string().required().trim().strict(),
  shortDescription: Joi.string().required().trim().strict(),
});

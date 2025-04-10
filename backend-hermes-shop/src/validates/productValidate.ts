import Joi from 'joi';
import type { ProductReqBody } from '~/models/productModel';

const productAttrsSchema = Joi.object({
  key: Joi.string().required().trim().strict(),
  type: Joi.string().required().trim().strict(),
});
const skuSchema = Joi.object({
  name: Joi.string().required().trim().strict(),
  price: Joi.number().positive(),
  discountPrice: Joi.number()
    .positive()
    .default(Joi.ref('price', { adjust: (value) => value })),
  attrs: Joi.array().items(
    Joi.object({
      key: Joi.string().required().trim().strict(),
      value: Joi.string().required().trim().strict(),
    }),
  ),
});

export const productSchema = Joi.object<ProductReqBody>({
  name: Joi.string().required().trim().strict(),
  shortDescription: Joi.string().required().trim().strict(),
  attrs: Joi.array().items(productAttrsSchema).default([]),
  skus: Joi.array().items(skuSchema).default([]),
});

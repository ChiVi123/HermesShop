import Joi from 'joi';
import type { SkuModel, SkuSpec } from '~/models/productModel';

export const skuValidate = Joi.object<SkuModel>({
  name: Joi.string().required().trim().strict(),
  price: Joi.number().positive(),
  discountPrice: Joi.number()
    .positive()
    .default(Joi.ref('price', { adjust: (value) => value })),
  specs: Joi.array<SkuSpec>().items(
    Joi.object<SkuSpec>({
      key: Joi.string().required().trim().strict(),
      value: Joi.string().required().trim().strict(),
    }),
  ),
});

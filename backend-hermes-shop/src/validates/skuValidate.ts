import Joi from 'joi';
import type { ProductSize, ProductVariantModel } from '~/models/productModel';

export const skuValidate = Joi.object<ProductVariantModel>({
  name: Joi.string().required().trim().strict(),
  price: Joi.number().positive(),
  discountPrice: Joi.number()
    .positive()
    .default(Joi.ref('price', { adjust: (value) => value })),
  sizes: Joi.array<ProductSize>().items(
    Joi.object<ProductSize>({
      key: Joi.string().required().trim().strict(),
      value: Joi.string().required().trim().strict(),
    }),
  ),
});

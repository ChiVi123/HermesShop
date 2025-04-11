import Joi from 'joi';

export const skuValidate = Joi.object({
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

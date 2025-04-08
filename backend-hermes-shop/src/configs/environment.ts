import 'dotenv/config';

import Joi from 'joi';
import type { StringValue } from 'ms';

interface IEnv {
  SERVER_PORT: number;
  SERVER_HOSTNAME: string;
  SERVER_COOKIE_MAX_AGE: StringValue;
  SERVER_ORIGIN_WHITELIST: string[];

  MONGO_URI: string;
  MONGO_DATABASE_NAME: string;

  ACCESS_TOKEN_SECRET_SIGNATURE: string;
  ACCESS_TOKEN_LIFE: StringValue;

  REFRESH_TOKEN_SECRET_SIGNATURE: string;
  REFRESH_TOKEN_LIFE: StringValue;
}
interface IEnvMongo {
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
  MONGO_CLUSTER_NAME: string;
}

// -----------------------
const envMongoSchema = Joi.object<IEnvMongo>({
  MONGO_USERNAME: Joi.string().trim().strict(),
  MONGO_PASSWORD: Joi.string().trim().strict(),
  MONGO_CLUSTER_NAME: Joi.string().trim().strict(),
});
const envMongoValues = {
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_CLUSTER_NAME: process.env.MONGO_CLUSTER_NAME,
};
const envMongoValidate = envMongoSchema.validate(envMongoValues);

if (envMongoValidate.error) throw envMongoValidate.error;

const { MONGO_CLUSTER_NAME, MONGO_PASSWORD, MONGO_USERNAME } = envMongoValidate.value;
const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER_NAME}.mongodb.net/`;

// -----------------------
const envValues = {
  SERVER_PORT: process.env.SERVER_PORT,
  SERVER_HOSTNAME: process.env.SERVER_HOSTNAME,
  SERVER_COOKIE_MAX_AGE: process.env.SERVER_COOKIE_MAX_AGE,
  SERVER_ORIGIN_WHITELIST: process.env.SERVER_ORIGIN_WHITELIST?.split(',') ?? [],

  MONGO_URI,
  MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME,

  ACCESS_TOKEN_SECRET_SIGNATURE: process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
  ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE,

  REFRESH_TOKEN_SECRET_SIGNATURE: process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
  REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE,
};

const envSchema = Joi.object<IEnv>({
  SERVER_PORT: Joi.number(),
  SERVER_HOSTNAME: Joi.string().trim().strict(),
  SERVER_COOKIE_MAX_AGE: Joi.string().trim().strict(),
  SERVER_ORIGIN_WHITELIST: Joi.array().items(
    Joi.string()
      .uri({ scheme: [/https?/] })
      .allow(''),
  ),

  MONGO_URI: Joi.string().trim().strict(),
  MONGO_DATABASE_NAME: Joi.string().trim().strict(),

  ACCESS_TOKEN_SECRET_SIGNATURE: Joi.string().trim().strict(),
  ACCESS_TOKEN_LIFE: Joi.string().trim().strict(),

  REFRESH_TOKEN_SECRET_SIGNATURE: Joi.string().trim().strict(),
  REFRESH_TOKEN_LIFE: Joi.string().trim().strict(),
});

const envValidated = envSchema.validate(envValues);

if (envValidated.error) throw envValidated.error;

const env = { ...envValidated.value };

export default env;

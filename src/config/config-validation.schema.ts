import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Specifying validation of .env variables
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_HOST: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().required(),
  BIZAWAY_API_KEY: Joi.string().required(),
  BIZAWAY_GET_TRIPS_URL: Joi.string().required(),
  JWT_TOKEN: Joi.string().required(),
});

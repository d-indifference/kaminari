/* eslint-disable newline-per-chained-call*/

import * as Joi from 'joi';

/**
 * .env file validation schema
 */
export const envValidationSchemaConfig: Joi.ObjectSchema = Joi.object({
	KAMINARI_INTERNAL_PORT: Joi.number().port().required(),
	KAMINARI_EXTERNAL_PORT: Joi.number().port().required(),
	KAMINARI_ASSETS_PUBLIC_DIR: Joi.string().required(),
	KAMINARI_ASSETS_VIEWS_DIR: Joi.string().required(),
	KAMINARI_FILES_DIR: Joi.string().required(),
	KAMINARI_VOLUMES_DIR: Joi.string().required(),
	KAMINARI_APP_VOLUME: Joi.string().required(),
	KAMINARI_POSTGRES_VOLUME: Joi.string().required(),
	KAMINARI_PGADMIN_VOLUME: Joi.string().required(),
	KAMINARI_SETTINGS_VOLUME: Joi.string().required(),
	KAMINARI_SESSION_SECRET: Joi.string().required(),
	KAMINARI_PRIVATE_KEY: Joi.string().required(),
	KAMINARI_ROOT_USER_EMAIL: Joi.string().required(),
	KAMINARI_ROOT_USER_PASSWORD: Joi.string().required(),
	KAMINARI_SKIP_ROOT_USER_CREATION: Joi.number().min(0).max(1).required(),
	KAMINARI_SQL_CONSOLE_PASSWORD: Joi.string().required()
});

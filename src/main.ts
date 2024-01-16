import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as process from 'process';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import { InitService } from '@toolkit/services';
import * as session from 'express-session';
import { sessionConfig } from '@config/session.config';
import { NotFoundExceptionFilter } from '@exceptions/not-found-exception.filter';
import { InternalServerErrorExceptionFilter } from '@exceptions/internal-server-error-exception.filter';
import { UnauthorizedExceptionFilter } from '@exceptions/unauthorized-exception.filter';
import { MethodNotAllowedExceptionFilter } from '@exceptions/method-not-allowed-exception.filter';
import { ForbiddenExceptionFilter } from '@exceptions/forbidden-exception.filter';
import { ConflictExceptionFilter } from '@exceptions/conflict-exception.filter';

let internalPort: number;

/**
 * Application Entry Point
 */
const bootstrap = async (): Promise<void> => {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	const configService = app.get(ConfigService);
	const initService = app.get(InitService);

	internalPort = configService.get<number>('KAMINARI_INTERNAL_PORT', 3000);

	await initService.initRootUser();

	app.useStaticAssets(path.join(process.cwd(), 'public'));
	app.setBaseViewsDir(path.join(process.cwd(), 'views'));
	app.setViewEngine('ejs');

	app.use(cookieParser());
	app.use(session(sessionConfig(configService)));

	app.useGlobalFilters(new ConflictExceptionFilter());
	app.useGlobalFilters(new ForbiddenExceptionFilter());
	app.useGlobalFilters(new InternalServerErrorExceptionFilter());
	app.useGlobalFilters(new MethodNotAllowedExceptionFilter());
	app.useGlobalFilters(new NotFoundExceptionFilter());
	app.useGlobalFilters(new UnauthorizedExceptionFilter());

	await app.listen(internalPort);
};

bootstrap().then(() => {
	Logger.log('ｷﾀ━━━(ﾟ∀ﾟ)━━━!!', 'main');
	Logger.log(
		`🚀 Server is started on http://localhost:${internalPort}/`,
		'main'
	);
});

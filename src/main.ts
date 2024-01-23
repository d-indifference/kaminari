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
import { BadRequestExceptionFilter } from '@exceptions/bad-request-exception.filter';
import { MigratorService } from '@migrator/migrator.service';
import * as fsExtra from 'fs-extra';

let internalPort: number;

/**
 * Application Entry Point
 */
const bootstrap = async (): Promise<void> => {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	const configService = app.get(ConfigService);
	const migratorService = app.get(MigratorService);

	const canContinueInit = await migratorService.connectToDb();

	if (canContinueInit) {
		if (!migratorService.isMigrationSkipped()) {
			Logger.log('Database migrations are not skipped', 'main');

			await migratorService.runPrismaMigrations();
		} else {
			Logger.log('Database migrations skipped', 'main');
		}

		internalPort = configService.get<number>(
			'KAMINARI_INTERNAL_PORT',
			3000
		);

		const initService = app.get(InitService);

		await initService.initRootUser();

		await fsExtra.ensureDir(
			path.join(
				process.cwd(),
				configService.getOrThrow<string>('KAMINARI_ASSETS_PUBLIC_DIR'),
				configService.getOrThrow<string>('KAMINARI_FILES_DIR')
			)
		);

		app.useStaticAssets(
			path.join(
				process.cwd(),
				configService.getOrThrow<string>('KAMINARI_ASSETS_PUBLIC_DIR')
			)
		);
		app.setBaseViewsDir(
			path.join(
				process.cwd(),
				configService.getOrThrow<string>('KAMINARI_ASSETS_VIEWS_DIR')
			)
		);
		app.setViewEngine('ejs');

		app.use(cookieParser());
		app.use(session(sessionConfig(configService)));

		app.useGlobalFilters(new BadRequestExceptionFilter());
		app.useGlobalFilters(new ConflictExceptionFilter());
		app.useGlobalFilters(new ForbiddenExceptionFilter());
		app.useGlobalFilters(new InternalServerErrorExceptionFilter());
		app.useGlobalFilters(new MethodNotAllowedExceptionFilter());
		app.useGlobalFilters(new NotFoundExceptionFilter());
		app.useGlobalFilters(new UnauthorizedExceptionFilter());

		await app.listen(internalPort);
	}
};

bootstrap().then(() => {
	Logger.log('ｷﾀ━━━(ﾟ∀ﾟ)━━━!!', 'main');
	Logger.log(
		`🚀 Server is started on http://localhost:${internalPort}/`,
		'main'
	);
});

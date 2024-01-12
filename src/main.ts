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

let internalPort: number;

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

	await app.listen(internalPort);
};

bootstrap().then(() => {
	Logger.log('ｷﾀ━━━(ﾟ∀ﾟ)━━━!!', 'main');
	Logger.log(
		`🚀 Server is started on http://localhost:${internalPort}/`,
		'main'
	);
});

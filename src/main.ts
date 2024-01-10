import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as process from 'process';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';

let internalPort: number;

const bootstrap = async (): Promise<void> => {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	const configService = app.get(ConfigService);

	internalPort = configService.get<number>('KAMINARI_INTERNAL_PORT', 3000);

	app.useStaticAssets(path.join(process.cwd(), 'public'));
	app.setBaseViewsDir(path.join(process.cwd(), 'views'));
	app.setViewEngine('ejs');

	app.use(cookieParser());

	await app.listen(internalPort);
};

bootstrap().then(() => {
	Logger.log('ｷﾀ━━━(ﾟ∀ﾟ)━━━!!', 'main');
	Logger.log(
		`🚀 Server is started on http://localhost:${internalPort}/`,
		'main'
	);
});

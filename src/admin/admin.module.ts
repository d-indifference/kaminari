import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '@toolkit/services';
import {
	AdminBoardsController,
	AdminController,
	AdminStaffController,
	AdminTechnicalInfoController
} from '@admin/controllers';
import {
	AdminBoardsService,
	AdminSignInService,
	AdminTechnicalInfoService,
	AdminStaffService
} from '@admin/services';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { nestjsFormDataConfig } from '@config/nestjs-form-data.config';

@Module({
	imports: [
		ConfigModule,
		NestjsFormDataModule.configAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: nestjsFormDataConfig
		})
	],
	controllers: [
		AdminController,
		AdminTechnicalInfoController,
		AdminStaffController,
		AdminBoardsController
	],
	providers: [
		PrismaService,
		AdminSignInService,
		AdminTechnicalInfoService,
		AdminStaffService,
		AdminBoardsService
	],
	exports: []
})
export class AdminModule {}

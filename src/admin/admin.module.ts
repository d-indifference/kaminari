import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '@toolkit/services';
import {
	AdminBoardsController,
	AdminController, AdminSettingsController,
	AdminStaffController,
	AdminTechnicalInfoController
} from '@admin/controllers';
import {
	AdminBoardsService,
	AdminSignInService,
	AdminTechnicalInfoService,
	AdminStaffService, AdminSettingsService
} from '@admin/services';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { nestjsFormDataConfig } from '@config/nestjs-form-data.config';
import { SettingsModule } from '@settings/settings.module';

@Module({
	imports: [
		ConfigModule,
		NestjsFormDataModule.configAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: nestjsFormDataConfig
		}),
		SettingsModule
	],
	controllers: [
		AdminController,
		AdminTechnicalInfoController,
		AdminStaffController,
		AdminBoardsController,
		AdminSettingsController
	],
	providers: [
		PrismaService,
		AdminSignInService,
		AdminTechnicalInfoService,
		AdminStaffService,
		AdminBoardsService,
		AdminSettingsService
	],
	exports: []
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileSystemService, PrismaService } from '@toolkit/services';
import {
	AdminBoardsController,
	AdminController,
	AdminSettingsController,
	AdminStaffController,
	AdminTechnicalInfoController
} from '@admin/controllers';
import {
	AdminBoardsService,
	AdminSignInService,
	AdminTechnicalInfoService,
	AdminStaffService,
	AdminSettingsService,
	AdminDependenciesService
} from '@admin/services';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { nestjsFormDataConfig } from '@config/nestjs-form-data.config';
import { SettingsModule } from '@settings/settings.module';
import { CommentsModule } from '@comments/comments.module';

@Module({
	imports: [
		ConfigModule,
		NestjsFormDataModule.configAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: nestjsFormDataConfig
		}),
		SettingsModule,
		CommentsModule
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
		FileSystemService,
		AdminSignInService,
		AdminTechnicalInfoService,
		AdminStaffService,
		AdminBoardsService,
		AdminSettingsService,
		AdminDependenciesService
	],
	exports: []
})
export class AdminModule {}

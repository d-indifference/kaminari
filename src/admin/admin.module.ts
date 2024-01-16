import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '@toolkit/services';
import {
	AdminController,
	AdminStaffController,
	AdminTechnicalInfoController
} from '@admin/controllers';
import { AdminSignInService, AdminTechnicalInfoService } from '@admin/services';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { nestjsFormDataConfig } from '@config/nestjs-form-data.config';
import { AdminStaffService } from '@admin/services/admin.staff.service';

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
		AdminStaffController
	],
	providers: [
		PrismaService,
		AdminSignInService,
		AdminTechnicalInfoService,
		AdminStaffService
	],
	exports: []
})
export class AdminModule {}

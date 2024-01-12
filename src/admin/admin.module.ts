import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '@toolkit/services';
import { AdminController } from '@admin/controllers';
import { AdminSignInService } from '@admin/services';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { nestjsFormDataConfig } from '@config/nestjs-form-data.config';

@Module({
	imports: [
		ConfigModule,
		NestjsFormDataModule.configAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: nestjsFormDataConfig
		}),
	],
	controllers: [AdminController],
	providers: [PrismaService, AdminSignInService],
	exports: []
})
export class AdminModule {}

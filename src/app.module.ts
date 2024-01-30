import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService, InitService } from '@toolkit/services';
import { envValidationSchemaConfig } from '@config/env-validation-schema.config';
import { AdminModule } from '@admin/admin.module';
import { SettingsModule } from '@settings/settings.module';
import { MigratorModule } from '@migrator/migrator.module';
import { CommentsModule } from '@comments/comments.module';
import { ForumModule } from '@forum/forum.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true,
			validationSchema: envValidationSchemaConfig
		}),
		AdminModule,
		SettingsModule,
		MigratorModule,
		CommentsModule,
		ForumModule
	],
	controllers: [AppController],
	providers: [PrismaService, InitService]
})
export class AppModule {}

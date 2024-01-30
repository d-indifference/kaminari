import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileSystemService, PrismaService } from '@toolkit/services';
import { CommentsModule } from '@comments/comments.module';
import { SettingsModule } from '@settings/settings.module';
import { ForumController, ForumTasksController } from '@forum/controllers';
import {
	ForumCreateService,
	ForumDeleteService,
	ForumService,
	CommentValidationService
} from '@forum/services';
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
		CommentsModule,
		SettingsModule
	],
	providers: [
		PrismaService,
		FileSystemService,
		ForumService,
		ForumCreateService,
		CommentValidationService,
		ForumDeleteService
	],
	controllers: [ForumController, ForumTasksController],
	exports: []
})
export class ForumModule {}

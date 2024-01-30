import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService, FileSystemService } from '@toolkit/services';
import {
	CommentCreateCommand,
	CommentQueries,
	CommentRemoveCommand,
	CommentUpdateCommand
} from '@comments/service';
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
	providers: [
		PrismaService,
		FileSystemService,
		CommentCreateCommand,
		CommentUpdateCommand,
		CommentRemoveCommand,
		CommentQueries
	],
	exports: [
		CommentCreateCommand,
		CommentUpdateCommand,
		CommentRemoveCommand,
		CommentQueries
	]
})
export class CommentsModule {}

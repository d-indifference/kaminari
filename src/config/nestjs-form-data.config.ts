import { FileSystemStoredFile } from 'nestjs-form-data';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as process from 'process';

/**
 * Config for NestjsFormDataModule
 * @param configService ConfigService
 */
export const nestjsFormDataConfig = (configService: ConfigService) => ({
	storage: FileSystemStoredFile,
	fileSystemStoragePath: path.join(
		process.cwd(),
		configService.getOrThrow<string>('KAMINARI_ASSETS_PUBLIC_DIR'),
		configService.getOrThrow<string>('KAMINARI_FILES_DIR')
	)
});

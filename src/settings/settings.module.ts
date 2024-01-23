import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SettingsService } from '@settings/services';

@Module({
	imports: [ConfigModule],
	providers: [SettingsService],
	exports: [SettingsService]
})
export class SettingsModule {}

import { Injectable } from '@nestjs/common';
import { SettingsService } from '@settings/services';
import { SettingsDto } from '@settings/dto';

/**
 * Admin panel settings service
 **/
@Injectable()
export class AdminSettingsService {
	constructor(private readonly settingsService: SettingsService) {}

	/**
	 * Get current active settings
	 * @return Current loaded site settings
	 */
	public getSettings(): SettingsDto {
		return this.settingsService.getSettings();
	}

	/**
	 * Update settings
	 * @param dto Settings DTO with updated data
	 */
	public async update(dto: SettingsDto): Promise<void> {
		await this.settingsService.update(dto);
	}
}

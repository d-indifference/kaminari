import { HeaderedSessionPageDto } from '@toolkit/dto/page';
import { SettingsDto } from '@settings/dto';

/**
 * Global settings page DTO
 */
export class SettingsPageDto extends HeaderedSessionPageDto {
	/**
	 * Global site settings DTO
	 */
	settings: SettingsDto;
}

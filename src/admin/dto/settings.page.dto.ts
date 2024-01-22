import { HeaderedSessionPageDto } from '@toolkit/dto/page';
import { SettingsDto } from '@settings/dto';

export class SettingsPageDto extends HeaderedSessionPageDto {
	settings: SettingsDto;
}

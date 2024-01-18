import { BasePageDto } from '@toolkit/dto/page/base-page.dto';
import { SessionPayloadDto } from '@admin/dto/session';

/**
 * Base for page template with session payload dynamic header
 */
export class HeaderedSessionPageDto extends BasePageDto {
	/**
	 * Page header
	 */
	header: string;

	/**
	 * Payload for storage in session
	 */
	session: SessionPayloadDto;
}

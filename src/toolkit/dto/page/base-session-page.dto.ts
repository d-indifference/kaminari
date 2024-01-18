import { BasePageDto } from '@toolkit/dto/page/base-page.dto';
import { SessionPayloadDto } from '@admin/dto/session';

/**
 * Base for page template with session payload
 */
export class BaseSessionPageDto extends BasePageDto {
	/**
	 * Payload for storage in session
	 */
	session: SessionPayloadDto;
}

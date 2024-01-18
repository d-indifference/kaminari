import { Cookie } from 'express-session';
import { SessionPayloadDto } from '@admin/dto/session/session-payload.dto';

/**
 * `req.session` object DTO
 */
export class SessionDto {
	/**
	 * `req.session` cookie
	 */
	cookie: Cookie;

	/**
	 * Payload for storage in session
	 */
	payload: SessionPayloadDto;
}

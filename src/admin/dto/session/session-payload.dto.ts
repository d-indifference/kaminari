import { UserRole } from '@prisma/client';

/**
 * Payload for storage in session
 */
export class SessionPayloadDto {
	/**
	 * User's email
	 */
	email: string;

	/**
	 * User's role
	 */
	role: UserRole;
}
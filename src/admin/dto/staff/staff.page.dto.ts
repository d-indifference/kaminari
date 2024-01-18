import { HeaderedSessionPageDto } from '@toolkit/dto/page';
import { UserRole } from '@prisma/client';

/**
 * Staff DTO displays staff data on edition form
 */
export class StaffPageDto extends HeaderedSessionPageDto {
	/**
	 * Switches template to creation or edition mode
	 */
	isCreationForm: boolean;

	/**
	 * ID
	 */
	id: string;

	/**
	 * Email
	 */
	email: string;

	/**
	 * Staff role
	 */
	role: UserRole;
}

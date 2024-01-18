import { UserRole } from '@prisma/client';

/**
 * Staff DTO for display in admin panel
 */
export class StaffDto {
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

	/**
	 * Staff DTO for display in admin panel
	 * @param id ID
	 * @param email Email
	 * @param role Staff role
	 */
	constructor(id: string, email: string, role: UserRole) {
		this.id = id;
		this.email = email;
		this.role = role;
	}
}

import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

/**
 * Staff role update DTO
 */
export class StaffUpdateDto {
	/**
	 * Staff role
	 */
	@IsEnum(UserRole)
	@IsNotEmpty()
	role: UserRole;
}

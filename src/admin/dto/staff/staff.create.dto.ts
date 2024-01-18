import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { UserRole } from '@prisma/client';

/**
 * Staff creation DTO
 */
export class StaffCreateDto {
	/**
	 * Email
	 */
	@IsEmail()
	@IsNotEmpty()
	email: string;

	/**
	 * Password
	 */
	@IsString()
	@IsNotEmpty()
	@Length(16)
	password: string;

	/**
	 * Staff role
	 */
	@IsEnum(UserRole)
	@IsNotEmpty()
	role: UserRole;
}

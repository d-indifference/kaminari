import { IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * Staff password update DTO
 */
export class StaffPasswordUpdateDto {
	/**
	 * Old password
	 */
	@IsString()
	@IsNotEmpty()
	oldPassword: string;

	/**
	 * New password
	 */
	@IsString()
	@IsNotEmpty()
	@Length(16)
	newPassword: string;

	/**
	 * Confirm new password
	 */
	@IsString()
	@IsNotEmpty()
	@Length(16)
	confirmPassword: string;
}

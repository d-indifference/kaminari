import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Staff email update DTO
 */
export class StaffEmailUpdateDto {
	/**
	 * New email
	 */
	@IsEmail()
	@IsNotEmpty()
	email: string;
}

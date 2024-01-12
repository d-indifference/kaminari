import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for sign in form
 */
export class SignInDto {
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
	password: string;
}

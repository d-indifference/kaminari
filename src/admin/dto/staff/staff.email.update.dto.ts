import { IsEmail, IsNotEmpty } from 'class-validator';

export class StaffEmailUpdateDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;
}

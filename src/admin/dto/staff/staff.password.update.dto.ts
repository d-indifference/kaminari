import { IsNotEmpty, IsString, Length } from 'class-validator';

export class StaffPasswordUpdateDto {
	@IsString()
	@IsNotEmpty()
	oldPassword: string;

	@IsString()
	@IsNotEmpty()
	@Length(16)
	newPassword: string;

	@IsString()
	@IsNotEmpty()
	@Length(16)
	confirmPassword: string;
}

import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { UserRole } from '@prisma/client';

export class StaffCreateDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@Length(16)
	password: string;

	@IsEnum(UserRole)
	@IsNotEmpty()
	role: UserRole;
}

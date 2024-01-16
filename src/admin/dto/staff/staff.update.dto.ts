import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class StaffUpdateDto {
	@IsEnum(UserRole)
	@IsNotEmpty()
	role: UserRole;
}

import { HeaderedSessionPageDto } from '@toolkit/dto/page';
import { UserRole } from '@prisma/client';

export class StaffPageDto extends HeaderedSessionPageDto {
	isCreationForm: boolean;

	id: string;

	email: string;

	role: UserRole;
}

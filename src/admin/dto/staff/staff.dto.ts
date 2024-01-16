import { UserRole } from '@prisma/client';

export class StaffDto {
	id: string;

	email: string;

	role: UserRole;

	constructor(id: string, email: string, role: UserRole) {
		this.id = id;
		this.email = email;
		this.role = role;
	}
}

import { HeaderedSessionPageDto } from '@toolkit/dto/page';

/**
 * Staff DTO displaying in My Profile section
 */
export class StaffMyProfileDto extends HeaderedSessionPageDto {
	/**
	 * Email
	 */
	email: string;
}

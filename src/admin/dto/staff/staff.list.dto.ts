import { HeaderedSessionPageDto } from '@toolkit/dto/page';
import { StaffDto } from '@admin/dto/staff/staff.dto';

export class StaffListDto extends HeaderedSessionPageDto {
	staff: StaffDto[];

	totalRecords: number;

	previousPageNumber?: number;

	nextPageNumber?: number;
}

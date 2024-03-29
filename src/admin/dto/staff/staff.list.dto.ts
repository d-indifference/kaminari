import { HeaderedSessionPageDto } from '@toolkit/dto/page';
import { StaffDto } from '@admin/dto/staff/staff.dto';

/**
 * Page of staff in admin panel
 */
export class StaffListDto extends HeaderedSessionPageDto {
	/**
	 * Staff list
	 */
	staff: StaffDto[];

	/**
	 * Total records count
	 */
	totalRecords: number;

	/**
	 * Previous page number
	 */
	previousPageNumber?: number;

	/**
	 * Next page number
	 */
	nextPageNumber?: number;
}

import { HeaderedSessionPageDto } from '@toolkit/dto/page';
import { BoardDto } from '@admin/dto/boards/board.dto';

/**
 * Page of boards in admin panel
 */
export class BoardListDto extends HeaderedSessionPageDto {
	/**
	 * Boards list
	 */
	boards: BoardDto[];

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

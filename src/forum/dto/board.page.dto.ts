import { CommentItemDto } from '@forum/dto/comment.item.dto';
import { BoardSettingsPageDto } from '@forum/dto/board-settings.page.dto';

/**
 * PageDTO displays info about board and comments page
 */
export class BoardPageDto extends BoardSettingsPageDto {
	/**
	 * Thread page
	 */
	threads: CommentItemDto[];

	/**
	 * Max page number on this board
	 */
	maxPageNumber: number;

	/**
	 * Current page number
	 */
	currentPageNumber: number;
}

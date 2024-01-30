import { CommentItemDto } from '@forum/dto/comment.item.dto';
import { BoardSettingsPageDto } from '@forum/dto/board-settings.page.dto';
import { Board } from '@prisma/client';
import { filesize } from 'filesize';

/**
 * PageDTO displays thread
 */
export class ThreadPageDto extends BoardSettingsPageDto {
	/**
	 * Thread
	 */
	thread: CommentItemDto;

	/**
	 * Create `ThreadPageDto`
	 * @param board `Board` Prisma entity
	 * @param thread `CommentItemDto` thread DTO
	 */
	public static create(board: Board, thread: CommentItemDto): ThreadPageDto {
		const dto = new ThreadPageDto();
		dto.url = board.url;
		dto.name = board.name;
		dto.enablePosting = board['boardSettings'].enablePosting;
		dto.enableFilesOnThread = board['boardSettings'].enableFilesOnThread;
		dto.enableFilesOnReply = board['boardSettings'].enableFilesOnReply;
		dto.strictAnonymousPosting =
			board['boardSettings'].strictAnonymousPosting;
		dto.threadKeepAliveTime = board['boardSettings'].threadKeepAliveTime;
		dto.additionalRules = board['boardSettings'].additionalRules;
		dto.maxFileSize = filesize(board['boardSettings'].maxFileSize, {
			base: 2,
			standard: 'jedec'
		});
		dto.thread = thread;

		return dto;
	}
}

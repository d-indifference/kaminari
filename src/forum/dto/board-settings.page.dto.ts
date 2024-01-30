import { ForumPageDto } from '@toolkit/dto/page';
import { Board } from '@prisma/client';
import { filesize } from 'filesize';

/**
 * Parent for board and thread page
 */
export class BoardSettingsPageDto extends ForumPageDto {
	/**
	 * Board URL
	 */
	url: string;

	/**
	 * Board name
	 */
	name: string;

	/**
	 * Enable posting on the board
	 */
	enablePosting: string;

	/**
	 * Enable file attachment on thread
	 */
	enableFilesOnThread: boolean;

	/**
	 * Enable file attachment on reply
	 */
	enableFilesOnReply: boolean;

	/**
	 * Posting without names
	 */
	strictAnonymousPosting: boolean;

	/**
	 * How many milliseconds thread will be kept alive on board after last hit
	 */
	threadKeepAliveTime: number;

	/**
	 * Additional board rules
	 */
	additionalRules: string;

	/**
	 * Max file size can be attachment to comment
	 */
	maxFileSize: string;

	/**
	 * Create `BoardPageDto`
	 * @param entity `Board` Prisma entity
	 */
	public static fromEntity(entity: Board): BoardSettingsPageDto {
		const dto = new BoardSettingsPageDto();
		dto.url = entity.url;
		dto.name = entity.name;
		dto.enablePosting = entity['boardSettings'].enablePosting;
		dto.enableFilesOnThread = entity['boardSettings'].enableFilesOnThread;
		dto.enableFilesOnReply = entity['boardSettings'].enableFilesOnReply;
		dto.strictAnonymousPosting =
			entity['boardSettings'].strictAnonymousPosting;
		dto.threadKeepAliveTime = entity['boardSettings'].threadKeepAliveTime;
		dto.additionalRules = entity['boardSettings'].additionalRules;
		dto.maxFileSize = filesize(entity['boardSettings'].maxFileSize, {
			base: 2,
			standard: 'jedec'
		});

		return dto;
	}
}

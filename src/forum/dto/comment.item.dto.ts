import { Comment } from '@prisma/client';
import { DateTime } from 'luxon';
import { filesize } from 'filesize';

/**
 * Comment item DTO
 */
export class CommentItemDto {
	/**
	 * Created at as understandable string
	 */
	createdAt: string;

	/**
	 * Poster's IP
	 */
	posterIp: string;

	/**
	 * Number on board
	 */
	numberOnBoard: number;

	/**
	 * Tripcode
	 */
	tripcode?: string;

	/**
	 * Name
	 */
	name?: string;

	/**
	 * Email
	 */
	email?: string;

	/**
	 * Subject
	 */
	subject?: string;

	/**
	 * Comment
	 */
	comment: string;

	/**
	 * Filename
	 */
	file?: string;

	/**
	 * File size at as understandable string
	 */
	fileSize?: string;

	/**
	 * Thumbnail filename
	 */
	fileThumb?: string;

	/**
	 * Omitted post count
	 */
	omittedPosts?: number;

	/**
	 * Omitted posts with files count
	 */
	omittedFiles?: number;

	/**
	 * Children comments
	 */
	// eslint-disable-next-line no-use-before-define
	replies?: CommentItemDto[];

	public static fromEntity(thread: Comment): CommentItemDto {
		const dto = new CommentItemDto();
		dto.createdAt = DateTime.fromJSDate(thread.createdAt).toFormat(
			'EEE dd MMM yyyy HH:mm:ss'
		);
		dto.posterIp = thread.posterIp;
		dto.numberOnBoard = thread.numberOnBoard;
		dto.tripcode = thread.tripcode;
		dto.name = thread.name;
		dto.email = thread.email;
		dto.subject = thread.subject;
		dto.comment = thread.comment;
		dto.file = thread.file;

		if (thread.fileSize) {
			dto.fileSize = filesize(thread.fileSize, {
				base: 2,
				standard: 'jedec'
			});
		} else {
			dto.fileSize = undefined;
		}

		dto.fileThumb = thread.fileThumb;

		return dto;
	}
}

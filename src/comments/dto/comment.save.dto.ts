import { FileSystemStoredFile } from 'nestjs-form-data';

/**
 * Comment DTO prepared to insert into database
 */
export class CommentSaveDto {
	/**
	 * Parent number on board
	 */
	parentNumber?: number;

	/**
	 * Poster IP
	 */
	posterIp: string;

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
	 * Password
	 */
	password: string;

	/**
	 * Uploaded file
	 */
	file?: FileSystemStoredFile;
}

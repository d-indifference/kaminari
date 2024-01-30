import { FileSystemStoredFile, HasMimeType, IsFile } from 'nestjs-form-data';
import {
	IsIn,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	MaxLength,
	MinLength
} from 'class-validator';

type ForumGoto = 'board' | 'thread';
const forumGotoValues: ForumGoto[] = ['board', 'thread'];

/**
 * Thread creation DTO
 */
export class CommentCreateDto {
	/**
	 * Name
	 */
	@IsString()
	@IsOptional()
	@MaxLength(256)
	name?: string;

	/**
	 * Email
	 */
	@IsString()
	@IsOptional()
	@MaxLength(256)
	email?: string;

	/**
	 * Subject
	 */
	@IsString()
	@IsOptional()
	@MaxLength(256)
	subject?: string;

	/**
	 * Comment
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(20000)
	comment: string;

	/**
	 * Password
	 */
	@IsString()
	@IsNotEmpty()
	@Length(8)
	password: string;

	/**
	 * File
	 */
	@IsFile()
	@IsOptional()
	@HasMimeType([
		'image/apng',
		'image/avif',
		'image/gif',
		'image/jpeg',
		'image/png',
		'image/svg+xml',
		'image/webp'
	])
	file?: FileSystemStoredFile;

	/**
	 * Go to board or thread after posting
	 */
	@IsString()
	@IsNotEmpty()
	@IsIn(forumGotoValues)
	goto: ForumGoto;
}

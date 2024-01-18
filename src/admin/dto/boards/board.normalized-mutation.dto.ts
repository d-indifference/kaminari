import {
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength
} from 'class-validator';

/**
 * Board DTO for creation / edition form data with normalized types
 */
export class BoardNormalizedMutationDto {
	/**
	 * URL
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(64)
	url: string;

	/**
	 * Name
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(256)
	name: string;

	/**
	 * Enable Posting on board
	 */
	@IsBoolean()
	@IsNotEmpty()
	enablePosting: boolean;

	/**
	 * Enable files attachment during thread creation
	 */
	@IsBoolean()
	@IsNotEmpty()
	enableFilesOnThread: boolean;

	/**
	 * Enable files attachment during reply creation
	 */
	@IsBoolean()
	@IsNotEmpty()
	enableFilesOnReply: boolean;

	/**
	 * Strict files attachment during thread creation
	 */
	@IsBoolean()
	@IsNotEmpty()
	strictFileOnThread: boolean;

	/**
	 * Strict files attachment during reply creation
	 */
	@IsBoolean()
	@IsNotEmpty()
	strictFileOnReply: boolean;

	/**
	 * Allow tripcode parsing
	 */
	@IsBoolean()
	@IsNotEmpty()
	enableTripcode: boolean;

	/**
	 * Allow tripcode parsing
	 */
	@IsBoolean()
	@IsNotEmpty()
	enableMarkdown: boolean;

	/**
	 * Delay between threads creation
	 */
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	@Max(Number.MAX_VALUE)
	delayBetweenThreads: number;

	/**
	 * Delay between threads creation
	 */
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	@Max(Number.MAX_VALUE)
	delayBetweenReplies: number;

	/**
	 * How many times thread will not be deleted after last reply
	 */
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	@Max(Number.MAX_VALUE)
	threadKeepAliveTime: number;

	/**
	 * Thread bump limit
	 */
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	@Max(Number.MAX_VALUE)
	bumpLimit: number;

	/**
	 * Strict anonymous posting (without names, emails, tripcodes, etc.)
	 */
	@IsBoolean()
	@IsNotEmpty()
	strictAnonymousPosting: boolean;

	/**
	 * Maximal count of active threads on board
	 */
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	@Max(Number.MAX_VALUE)
	maxThreadCount: number;

	/**
	 * Additional rules
	 */
	@IsOptional()
	additionalRules: string;

	/**
	 * Max file size
	 */
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	@Max(Number.MAX_VALUE)
	maxFileSize: number;

	/**
	 * Max comment length
	 */
	@IsNumber()
	@IsNotEmpty()
	@Min(1)
	@Max(Number.MAX_VALUE)
	maxCommentLength: number;
}

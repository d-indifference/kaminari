import {
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength
} from 'class-validator';
import { HtmlCheckboxBoolean, htmlCheckboxBooleanRegexp } from '@toolkit/types';

/**
 * Board DTO for creation / edition form data
 */
export class BoardMutationDto {
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
	@IsOptional()
	@Matches(htmlCheckboxBooleanRegexp)
	enablePosting: HtmlCheckboxBoolean;

	/**
	 * Enable files attachment during thread creation
	 */
	@IsOptional()
	@Matches(htmlCheckboxBooleanRegexp)
	enableFilesOnThread: HtmlCheckboxBoolean;

	/**
	 * Enable files attachment during reply creation
	 */
	@IsOptional()
	@Matches(htmlCheckboxBooleanRegexp)
	enableFilesOnReply: HtmlCheckboxBoolean;

	/**
	 * Strict files attachment during thread creation
	 */
	@IsOptional()
	@Matches(htmlCheckboxBooleanRegexp)
	strictFileOnThread: HtmlCheckboxBoolean;

	/**
	 * Strict files attachment during reply creation
	 */
	@IsOptional()
	@Matches(htmlCheckboxBooleanRegexp)
	strictFileOnReply: HtmlCheckboxBoolean;

	/**
	 * Allow tripcode parsing
	 */
	@IsOptional()
	@Matches(htmlCheckboxBooleanRegexp)
	enableTripcode: HtmlCheckboxBoolean;

	/**
	 * Allow markdown parsing
	 */
	@IsOptional()
	@Matches(htmlCheckboxBooleanRegexp)
	enableMarkdown: HtmlCheckboxBoolean;

	/**
	 * Delay between threads creation
	 */
	@IsString()
	@IsNotEmpty()
	@IsNumberString()
	delayBetweenThreads: string;

	/**
	 * Delay between threads creation
	 */
	@IsString()
	@IsNotEmpty()
	@IsNumberString()
	delayBetweenReplies: string;

	/**
	 * How many times thread will not be deleted after last reply
	 */
	@IsString()
	@IsNotEmpty()
	@IsNumberString()
	threadKeepAliveTime: string;

	/**
	 * Thread bump limit
	 */
	@IsString()
	@IsNotEmpty()
	@IsNumberString()
	bumpLimit: string;

	/**
	 * Strict anonymous posting (without names, emails, tripcodes, etc.)
	 */
	@IsOptional()
	@Matches(htmlCheckboxBooleanRegexp)
	strictAnonymousPosting: HtmlCheckboxBoolean;

	/**
	 * Maximal count of active threads on board
	 */
	@IsString()
	@IsNotEmpty()
	@IsNumberString()
	maxThreadCount: string;

	/**
	 * Additional rules
	 */
	@IsOptional()
	additionalRules: string;

	/**
	 * Max file size
	 */
	@IsString()
	@IsNotEmpty()
	@IsNumberString()
	maxFileSize: string;

	/**
	 * Max comment length
	 */
	@IsString()
	@IsNotEmpty()
	@IsNumberString()
	maxCommentLength: string;
}

import { HeaderedSessionPageDto } from '@toolkit/dto/page';

/**
 * Board DTO displays board data on edition form
 */
export class BoardFormDto extends HeaderedSessionPageDto {
	/**
	 * Switches template to creation or edition mode
	 */
	isCreationForm: boolean;

	/**
	 * ID
	 */
	id: string;

	/**
	 * URL
	 */
	url: string;

	/**
	 * Name
	 */
	name: string;

	/**
	 * Enable Posting on board
	 */
	enablePosting: boolean;

	/**
	 * Enable files attachment during thread creation
	 */
	enableFilesOnThread: boolean;

	/**
	 * Enable files attachment during reply creation
	 */
	enableFilesOnReply: boolean;

	/**
	 * Strict files attachment during thread creation
	 */
	strictFileOnThread: boolean;

	/**
	 * Strict files attachment during reply creation
	 */
	strictFileOnReply: boolean;

	/**
	 * Allow tripcode parsing
	 */
	enableTripcode: boolean;

	/**
	 * Allow markdown parsing
	 */
	enableMarkdown: boolean;

	/**
	 * Delay between threads creation
	 */
	delayBetweenThreads: number;

	/**
	 * Delay between threads creation
	 */
	delayBetweenReplies: number;

	/**
	 * How many times thread will not be deleted after last reply
	 */
	threadKeepAliveTime: number;

	/**
	 * Thread bump limit
	 */
	bumpLimit: number;

	/**
	 * Strict anonymous posting (without names, emails, tripcodes, etc.)
	 */
	strictAnonymousPosting: boolean;

	/**
	 * Maximal count of active threads on board
	 */
	maxThreadCount: number;

	/**
	 * Additional rules
	 */
	additionalRules: string;

	/**
	 * Max file size
	 */
	maxFileSize: number;

	/**
	 * Max comment length
	 */
	maxCommentLength: number;
}

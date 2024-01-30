/**
 * Board DTO for creation / edition form data with normalized types
 */
export class BoardNormalizedMutationDto {
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
	 * Allow tripcode parsing
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

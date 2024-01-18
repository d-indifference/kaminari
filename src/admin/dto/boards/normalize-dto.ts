import { BoardMutationDto } from '@admin/dto/boards/board.mutation.dto';
import { BoardNormalizedMutationDto } from '@admin/dto/boards';

/**
 * Normalize boolean form HTML checkbox value
 */
const normalizeBoolean = (value: string): boolean => value === 'on';

/**
 * Normalize types in `BoardMutationDto`
 * @param initialDto `BoardMutationDto` with HTML form data types
 * @return DTO with normalized types
 */
export const normalizeDto = (
	initialDto: BoardMutationDto
): BoardNormalizedMutationDto => {
	const result = new BoardNormalizedMutationDto();

	result.url = initialDto.url;
	result.name = initialDto.name;
	result.enablePosting = normalizeBoolean(initialDto.enablePosting);
	result.enableFilesOnThread = normalizeBoolean(
		initialDto.enableFilesOnThread
	);
	result.enableFilesOnReply = normalizeBoolean(initialDto.enableFilesOnReply);
	result.strictFileOnThread = normalizeBoolean(initialDto.strictFileOnThread);
	result.strictFileOnReply = normalizeBoolean(initialDto.strictFileOnReply);
	result.enableTripcode = normalizeBoolean(initialDto.enableTripcode);
	result.enableMarkdown = normalizeBoolean(initialDto.enableMarkdown);
	result.delayBetweenThreads = Number(initialDto.delayBetweenThreads);
	result.delayBetweenReplies = Number(initialDto.delayBetweenReplies);
	result.threadKeepAliveTime = Number(initialDto.threadKeepAliveTime);
	result.bumpLimit = Number(initialDto.bumpLimit);
	result.strictAnonymousPosting = normalizeBoolean(
		initialDto.strictAnonymousPosting
	);
	result.maxThreadCount = Number(initialDto.maxThreadCount);
	result.additionalRules = initialDto.additionalRules;
	result.maxFileSize = Number(initialDto.maxFileSize);
	result.maxCommentLength = Number(initialDto.maxCommentLength);

	return result;
};

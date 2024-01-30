import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import {
	BoardMutationDto,
	BoardNormalizedMutationDto
} from '@admin/dto/boards';
import {
	ParseFormCheckboxPipe,
	ParsePositiveIntegerPipe
} from '@toolkit/pipes';

/**
 * Transform `BoardMutationDto` to `BoardNormalizedMutationDto`
 */
@Injectable()
export class NormalizeBoardMutationDtoPipe implements PipeTransform {
	async transform(
		value: BoardMutationDto,
		metadata: ArgumentMetadata
	): Promise<BoardNormalizedMutationDto> {
		const parsePositiveIntegerPipe = new ParsePositiveIntegerPipe();
		const parseFormCheckboxPipe = new ParseFormCheckboxPipe();

		const result = new BoardNormalizedMutationDto();

		result.url = value.url;
		result.name = value.name;

		result.enablePosting = parseFormCheckboxPipe.transform(
			value.enablePosting,
			metadata
		);
		result.enableFilesOnThread = parseFormCheckboxPipe.transform(
			value.enableFilesOnThread,
			metadata
		);
		result.enableFilesOnReply = parseFormCheckboxPipe.transform(
			value.enableFilesOnReply,
			metadata
		);
		result.strictFileOnThread = parseFormCheckboxPipe.transform(
			value.strictFileOnThread,
			metadata
		);
		result.strictFileOnReply = parseFormCheckboxPipe.transform(
			value.strictFileOnReply,
			metadata
		);
		result.enableTripcode = parseFormCheckboxPipe.transform(
			value.enableTripcode,
			metadata
		);
		result.enableMarkdown = parseFormCheckboxPipe.transform(
			value.enableMarkdown,
			metadata
		);
		result.delayBetweenThreads = await parsePositiveIntegerPipe.transform(
			value.delayBetweenThreads,
			metadata
		);
		result.delayBetweenReplies = await parsePositiveIntegerPipe.transform(
			value.delayBetweenReplies,
			metadata
		);
		result.threadKeepAliveTime = await parsePositiveIntegerPipe.transform(
			value.threadKeepAliveTime,
			metadata
		);
		result.bumpLimit = await parsePositiveIntegerPipe.transform(
			value.bumpLimit,
			metadata
		);
		result.strictAnonymousPosting = parseFormCheckboxPipe.transform(
			value.strictAnonymousPosting,
			metadata
		);
		result.maxThreadCount = await parsePositiveIntegerPipe.transform(
			value.maxThreadCount,
			metadata
		);
		result.additionalRules = value.additionalRules;
		result.maxFileSize = await parsePositiveIntegerPipe.transform(
			value.maxFileSize,
			metadata
		);
		result.maxCommentLength = await parsePositiveIntegerPipe.transform(
			value.maxCommentLength,
			metadata
		);

		return result;
	}
}

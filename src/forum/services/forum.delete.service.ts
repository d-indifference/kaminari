import { Injectable, Logger, ParseIntPipe } from '@nestjs/common';
import { CommentRemoveCommand } from '@comments/service';
import { BoardDeleteCommentsDto } from '@forum/dto';
import { logWithObject } from '@toolkit/log-with-object';
import { PrismaService } from '@toolkit/services';

/**
 * Forum comments deletion service
 */
@Injectable()
export class ForumDeleteService {
	private readonly logger = new Logger(ForumDeleteService.name);

	constructor(
		private readonly commentRemoveCommand: CommentRemoveCommand,
		private readonly prisma: PrismaService
	) {}

	/**
	 * Delete comments or clear its files
	 * @param url Board which comments will be deleted
	 * @param dto Deletion DTO
	 */
	public async deleteComments(
		url: string,
		dto: BoardDeleteCommentsDto
	): Promise<void> {
		this.logger.log(logWithObject(`Remove comments from /${url}`, dto));

		const deleteCandidates = await this.prisma.comment.findMany({
			where: {
				board: { url },
				numberOnBoard: {
					in: await this.stringArrayToIntArray(dto.delete)
				},
				password: dto.password
			},
			include: { board: true }
		});

		if (dto.fileOnly === 'on') {
			this.logger.log('Files will be cleared');

			await this.commentRemoveCommand.clearFiles(deleteCandidates);
		} else {
			this.logger.log('Comments will be removed');

			await this.commentRemoveCommand.removeComments(deleteCandidates);
		}

		await this.commentRemoveCommand.removeOrphanedComments();
	}

	private async stringArrayToIntArray(
		deleteCandidates: string[] | string
	): Promise<number[]> {
		const result: number[] = [];
		const parseIntPipe = new ParseIntPipe();

		if (typeof deleteCandidates === 'string') {
			result.push(await parseIntPipe.transform(deleteCandidates, null));
		} else {
			for (const candidate of deleteCandidates) {
				result.push(await parseIntPipe.transform(candidate, null));
			}
		}

		return result;
	}
}

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CommentQueries } from '@comments/service';
import { PrismaService } from '@toolkit/services';
import { BoardPageDto, CommentItemDto, ThreadPageDto } from '@forum/dto';
import { logWithObject } from '@toolkit/log-with-object';
import { Board, Comment } from '@prisma/client';
import * as _ from 'lodash';

/**
 * Forum queries service
 */
@Injectable()
export class ForumService {
	private readonly logger = new Logger(ForumService.name);

	constructor(
		private readonly commentQueries: CommentQueries,
		private readonly prisma: PrismaService
	) {}

	/**
	 * Get forum page with thread list
	 * @param url Board URL
	 * @param page Page number
	 * @return `BoardPageDto` with list of threads on current page
	 */
	public async findAllThreads(
		url: string,
		page: number
	): Promise<BoardPageDto> {
		const board = await this.prisma.board.findFirst({
			where: { url },
			include: {
				comments: { include: { children: true } },
				boardSettings: true
			}
		});

		this.checkBoardExists(board, url);

		const pageDto = BoardPageDto.fromEntity(board) as BoardPageDto;

		const pageSize = 5;

		const pageRequest = await this.getCommentsPageRequest(
			url,
			page,
			pageSize
		);
		pageDto.threads = pageRequest.threads;
		pageDto.maxPageNumber = pageRequest.maxPageNumber;
		pageDto.currentPageNumber = page;

		return pageDto;
	}

	/**
	 * Get full thread with replies
	 * @param url Board URL
	 * @param numberOnBoard Comment number
	 * @return `ThreadPageDto` with list of thread replies
	 */
	public async getThread(
		url: string,
		numberOnBoard: number
	): Promise<ThreadPageDto> {
		const board = await this.prisma.board.findFirst({
			where: { url },
			include: {
				comments: { include: { children: true } },
				boardSettings: true
			}
		});

		this.checkBoardExists(board, url);

		const thread = await this.commentQueries.getThread(url, numberOnBoard);
		const replies: CommentItemDto[] = thread['children'].map(
			(reply: Comment) => CommentItemDto.fromEntity(reply)
		);

		const threadDto = CommentItemDto.fromEntity(thread);
		threadDto.replies = replies;

		return ThreadPageDto.create(board, threadDto);
	}

	private checkBoardExists(board: Board, url: string): void {
		if (!board) {
			this.logger.log(logWithObject('Board was not found', { url }));

			throw new NotFoundException(`Cannot get /${url}`);
		}
	}

	private async getCommentsPageRequest(
		url: string,
		page: number,
		size: number
	): Promise<Pick<BoardPageDto, 'threads' | 'maxPageNumber'>> {
		const threads = await this.prisma.comment.findMany({
			where: { lastHit: { not: null }, board: { url } },
			orderBy: { lastHit: 'desc' },
			include: { children: true, board: true },
			skip: page * size,
			take: size
		});

		const threadCount = await this.commentQueries.getThreadsCount(url);
		let pageCount = Math.floor(threadCount / size);

		if (threadCount % size > 0) {
			pageCount += 1;
		}

		const threadsDto = threads.map(thread => {
			const repliesDisplayOnBoard = 5;

			const children = thread.children;
			const childrenWithFilesLength = _.filter(
				thread.children,
				child => child.file !== null
			).length;

			const threadDto = CommentItemDto.fromEntity(thread);

			threadDto.replies = _.takeRight(
				_.sortBy(children, 'createdAt'),
				repliesDisplayOnBoard
			).map(child => CommentItemDto.fromEntity(child));

			const shownRepliesWithFiles = _.filter(
				threadDto.replies,
				child => child.file !== null
			).length;

			threadDto.omittedPosts = children.length - repliesDisplayOnBoard;
			threadDto.omittedFiles =
				childrenWithFilesLength - shownRepliesWithFiles;

			return threadDto;
		});

		return {
			threads: threadsDto,
			maxPageNumber: pageCount - 1
		};
	}
}

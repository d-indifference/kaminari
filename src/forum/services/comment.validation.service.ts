import {
	BadRequestException,
	Injectable,
	Logger,
	MethodNotAllowedException,
	NotFoundException
} from '@nestjs/common';
import { PrismaService } from '@toolkit/services';
import { CommentCreateDto } from '@forum/dto';
import { Board, BoardSettings } from '@prisma/client';
import { filesize } from 'filesize';
import { DateTime } from 'luxon';
import { logWithObject } from '@toolkit/log-with-object';
import { CommentQueries } from '@comments/service';

/**
 * Service for comments' validation
 */
@Injectable()
export class CommentValidationService {
	private readonly logger = new Logger(CommentValidationService.name);

	constructor(private readonly prisma: PrismaService, private readonly commentQueries: CommentQueries) {}

	/**
	 * Validate comment to be able to post on current board.
	 * If validation is not passed, throws `HttpException`
	 * @param dto Thread creation DTO
	 * @param url Board URL
	 * @param ip Poster's UP
	 */
	public async validate(
		url: string,
		dto: CommentCreateDto,
		ip: string
	): Promise<void> {
		const board = await this.getBoardOr404(url);
		const settings = board['boardSettings'] as BoardSettings;

		this.checkEnabledPosting(settings);
		await this.checkDelayBetweenThreads(ip, settings);
		await this.checkMaxThreadsCount(board, settings);
		this.checkAnonymousPosting(dto, settings);
		this.checkMaxCommentLength(dto, settings);
		this.checkEnabledFilesOnThread(dto, settings);
		this.checkStrictFileOnThread(dto, settings);
		this.checkMaxFileSize(dto, settings);
	}

	public async validateReply(
		url: string,
		numberOnBoard: number,
		dto: CommentCreateDto,
		ip: string
	): Promise<void> {
		const board = await this.getBoardOr404(url);
		const settings = board['boardSettings'] as BoardSettings;
		await this.commentQueries.getThread(url, numberOnBoard);

		this.checkEnabledPosting(settings);
		await this.checkDelayBetweenReplies(ip, settings);
		this.checkAnonymousPosting(dto, settings);
		this.checkMaxCommentLength(dto, settings);
		this.checkEnabledFilesOnReply(dto, settings);
		this.checkStrictFileOnReply(dto, settings);
		this.checkMaxFileSize(dto, settings);
	}

	private checkEnabledPosting(boardSettings: BoardSettings): void {
		if (!boardSettings.enablePosting) {
			this.logger.warn(
				'Trying to create comment on board with disabled posting'
			);

			throw new MethodNotAllowedException('Posting is disabled here.');
		}
	}

	private checkEnabledFilesOnThread(
		dto: CommentCreateDto,
		boardSettings: BoardSettings
	): void {
		if (!boardSettings.enableFilesOnThread && dto.file !== undefined) {
			this.logger.warn(
				'Trying to upload a file on board with disabled thread file uploading'
			);

			throw new BadRequestException('You cannot upload files here.');
		}
	}

	private checkEnabledFilesOnReply(
		dto: CommentCreateDto,
		boardSettings: BoardSettings
	): void {
		if (!boardSettings.enableFilesOnReply && dto.file !== undefined) {
			this.logger.warn(
				'Trying to upload a file on board with disabled thread file uploading'
			);

			throw new BadRequestException('You cannot upload files here.');
		}
	}

	private checkStrictFileOnThread(
		dto: CommentCreateDto,
		boardSettings: BoardSettings
	): void {
		if (boardSettings.strictFileOnThread && dto.file === undefined) {
			this.logger.log(
				'Trying to create thread without file on board with required file'
			);

			throw new BadRequestException('Please attach any file.');
		}
	}

	private checkStrictFileOnReply(
		dto: CommentCreateDto,
		boardSettings: BoardSettings
	): void {
		if (boardSettings.strictFileOnReply && dto.file === undefined) {
			this.logger.log(
				'Trying to create thread without file on board with required file'
			);

			throw new BadRequestException('Please attach any file.');
		}
	}

	private checkAnonymousPosting(
		dto: CommentCreateDto,
		boardSettings: BoardSettings
	): void {
		const notEmptyName = dto.name !== '' && dto.name !== undefined;
		console.log(notEmptyName);

		if (notEmptyName && boardSettings.strictAnonymousPosting) {
			this.logger.warn(
				'Trying to create thread with name on board with anonymous posting'
			);

			throw new BadRequestException(
				'You should post your comments without name here.'
			);
		}
	}

	private checkMaxCommentLength(
		dto: CommentCreateDto,
		boardSettings: BoardSettings
	): void {
		if (dto.comment.length > boardSettings.maxCommentLength) {
			this.logger.log('Trying to create thread with too big length');

			throw new BadRequestException(
				`Your comment is longer than ${boardSettings.maxCommentLength} symbols.`
			);
		}
	}

	private async checkMaxThreadsCount(
		board: Board,
		settings: BoardSettings
	): Promise<void> {
		const threadCount = await this.prisma.comment.count({
			where: { board: { id: board.id }, lastHit: { not: null } }
		});

		if (threadCount >= settings.maxThreadCount) {
			this.logger.log(
				'Trying to create redundant thread on full-filled board'
			);

			throw new MethodNotAllowedException(
				'You cannot create new thread here because there is too much threads on this board.'
			);
		}
	}

	private checkMaxFileSize(
		dto: CommentCreateDto,
		boardSettings: BoardSettings
	): void {
		if (dto.file) {
			if (dto.file.size > boardSettings.maxFileSize) {
				this.logger.warn(
					'Trying to upload a file with a too huge size'
				);

				throw new BadRequestException(
					`Please upload a file smaller than ${filesize(
						boardSettings.maxFileSize,
						{ base: 2, standard: 'jedec' }
					)}.`
				);
			}
		}
	}

	private async checkDelayBetweenThreads(
		ip: string,
		boardSettings: BoardSettings
	): Promise<void> {
		const lastThread = await this.prisma.comment.findFirst({
			where: { lastHit: { not: null }, posterIp: ip },
			orderBy: { createdAt: 'desc' }
		});

		if (lastThread) {
			const now = DateTime.fromJSDate(new Date());
			const createdAt = DateTime.fromJSDate(lastThread.createdAt);

			const difference = now.diff(createdAt);

			if (
				difference.as('milliseconds') <
				boardSettings.delayBetweenThreads
			) {
				this.logger.log(
					logWithObject(
						'Trying to to create threads is too frequent',
						{
							ip
						}
					)
				);

				throw new MethodNotAllowedException(
					'The attempt to create threads is too frequent.'
				);
			}
		}
	}

	private async checkDelayBetweenReplies(
		ip: string,
		boardSettings: BoardSettings
	): Promise<void> {
		const lastComment = await this.prisma.comment.findFirst({
			where: { posterIp: ip },
			orderBy: { createdAt: 'desc' }
		});

		if (lastComment) {
			const now = DateTime.fromJSDate(new Date());
			const createdAt = DateTime.fromJSDate(lastComment.createdAt);

			const difference = now.diff(createdAt);

			if (
				difference.as('milliseconds') <
				boardSettings.delayBetweenReplies
			) {
				this.logger.log(
					logWithObject(
						'Trying to to posting comments is too frequent',
						{
							ip
						}
					)
				);

				throw new MethodNotAllowedException(
					'The attempt to posting comments is too frequent.'
				);
			}
		}
	}

	private async getBoardOr404(url: string): Promise<Board> {
		const board = await this.prisma.board.findFirst({
			where: { url },
			include: { boardSettings: true }
		});

		if (!board) {
			this.logger.log(logWithObject('Board was not found', { url }));

			throw new NotFoundException(`Board '/${url}' was not found`);
		}

		return board;
	}
}

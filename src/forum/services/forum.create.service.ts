import { Injectable, Logger } from '@nestjs/common';
import {
	CommentCreateCommand,
	CommentQueries,
	CommentUpdateCommand
} from '@comments/service';
import { CommentCreateDto } from '@forum/dto';
import { Board, Comment } from '@prisma/client';
import { logWithObject } from '@toolkit/log-with-object';
import { CommentSaveDto } from '@comments/dto';
import * as he from 'he';
import { PrismaService } from '@toolkit/services';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tripcode = require('tripcode');

/**
 * Forum comments creation service
 */
@Injectable()
export class ForumCreateService {
	private readonly logger = new Logger(ForumCreateService.name);

	constructor(
		private readonly commentQueries: CommentQueries,
		private readonly commentCreateCommand: CommentCreateCommand,
		private readonly commentUpdateCommand: CommentUpdateCommand,
		private readonly prisma: PrismaService
	) {}

	/**
	 * Create new thread
	 * @param dto Thread creation DTO
	 * @param url Board URL
	 * @param ip Poster's UP
	 * @return `Comment` entity
	 */
	public async createThread(
		dto: CommentCreateDto,
		url: string,
		ip: string
	): Promise<Comment> {
		this.logger.log(
			logWithObject(`Create new thread on /${url}, IP: ${ip}`, dto)
		);

		const saveDto = this.prepareSaveDto(dto, ip);
		saveDto.parentNumber = null;

		const board = await this.prisma.board.findFirst({
			where: { url },
			include: { boardSettings: true }
		});

		if (board.boardSettings.enableTripcode) {
			this.setNameOrTripcode(saveDto, dto);
		} else {
			saveDto.name = dto.name;
			saveDto.tripcode = null;
		}

		const newThread = await this.commentCreateCommand.createThread(
			url,
			saveDto
		);

		this.logger.log(
			logWithObject('Thread has been created', { id: newThread.id })
		);

		return newThread;
	}

	/**
	 * Create new reply
	 * @param dto Reply creation DTO
	 * @param url Board URL
	 * @param numberOnBoard Parent number
	 * @param ip Poster's UP
	 * @return `Comment` entity
	 */
	public async createReply(
		dto: CommentCreateDto,
		url: string,
		numberOnBoard: number,
		ip: string
	): Promise<Comment> {
		this.logger.log(
			logWithObject(
				`Create new reply on /${url}/res/${numberOnBoard}, IP: ${ip}`,
				dto
			)
		);

		const saveDto = this.prepareSaveDto(dto, ip);
		saveDto.parentNumber = numberOnBoard;

		const board = await this.prisma.board.findFirst({
			where: { url },
			include: { boardSettings: true }
		});

		if (board.boardSettings.enableTripcode) {
			this.setNameOrTripcode(saveDto, dto);
		} else {
			saveDto.name = dto.name;
			saveDto.tripcode = null;
		}

		const newReply = await this.commentCreateCommand.createReply(
			url,
			numberOnBoard,
			saveDto
		);

		this.logger.log(
			logWithObject('Reply has been created', { id: newReply.id })
		);

		await this.processLastHit(url, numberOnBoard, board, dto);

		return newReply;
	}

	private async processLastHit(
		url: string,
		numberOnBoard: number,
		board: Board,
		dto: CommentCreateDto
	): Promise<void> {
		const email = dto.email.toLowerCase().trim();

		if (email !== 'sage') {
			const threadRepliesCount =
				await this.commentQueries.getThreadCommentsCount(
					url,
					numberOnBoard
				);

			if (threadRepliesCount <= board['boardSettings'].bumpLimit) {
				const parentComment = await this.commentQueries.getThread(
					url,
					numberOnBoard
				);

				this.logger.log(
					`Thread /${url}/res/${numberOnBoard} will be hit`
				);

				await this.commentUpdateCommand.updateLastHit(parentComment);
			} else {
				this.logger.log(
					`Thread /${url}/res/${numberOnBoard} will not be hit`
				);
			}
		} else {
			this.logger.log(
				`Thread /${url}/res/${numberOnBoard} will not be hit`
			);
		}
	}

	private prepareSaveDto(dto: CommentCreateDto, ip: string): CommentSaveDto {
		const saveDto = new CommentSaveDto();
		saveDto.posterIp = ip;
		saveDto.email = this.normalizeEmptyString(dto.email);
		saveDto.subject = this.normalizeEmptyString(dto.subject);
		saveDto.comment = he.encode(dto.comment);
		saveDto.password = dto.password;
		saveDto.file = dto.file;

		return saveDto;
	}

	private setNameOrTripcode(
		saveDto: CommentSaveDto,
		dto: CommentCreateDto
	): void {
		if (dto.name) {
			if (dto.name.indexOf('#', 0) !== -1) {
				saveDto.name = null;
				saveDto.tripcode = tripcode(dto.name);
			} else {
				saveDto.name = dto.name;
				saveDto.tripcode = null;
			}
		} else {
			saveDto.name = null;
			saveDto.tripcode = null;
		}
	}

	private normalizeEmptyString(str: string): string | null {
		if (str === '') {
			return null;
		}

		return str;
	}
}

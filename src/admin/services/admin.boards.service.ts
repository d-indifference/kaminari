import {
	ConflictException,
	Injectable,
	Logger,
	NotFoundException
} from '@nestjs/common';
import { FileSystemService, PrismaService } from '@toolkit/services';
import {
	BoardDto,
	BoardFormDto,
	BoardListDto,
	BoardNormalizedMutationDto
} from '@admin/dto/boards';
import { Board } from '@prisma/client';
import { logWithObject } from '@toolkit/log-with-object';
import { PrismaPaginator } from '@toolkit/prisma-paginator';
import { filesize } from 'filesize';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import * as process from 'process';
import { CommentQueries, CommentRemoveCommand } from '@comments/service';

/**
 * Admin panel board service
 */
@Injectable()
export class AdminBoardsService {
	private readonly logger = new Logger(AdminBoardsService.name);

	private readonly systemReservedUrls: string[] = [
		'menu',
		'main',
		'admin',
		'faq',
		'rules'
	];

	constructor(
		private readonly prisma: PrismaService,
		private readonly fileSystemService: FileSystemService,
		private readonly configService: ConfigService,
		private readonly commentQueries: CommentQueries,
		private readonly commentRemoveCommand: CommentRemoveCommand
	) {}

	/**
	 * Find all boards and get list page
	 * @param pageNumber Page Number
	 * @return Board list page
	 */
	public async findAll(pageNumber = 0): Promise<BoardListDto> {
		const pageSize = 10;

		const listDto = new BoardListDto();

		const paginator = new PrismaPaginator(this.prisma, 'board');

		const page = await paginator.pageRequest<Board>(pageNumber, pageSize);

		listDto.boards = [];

		if (page.totalCount > 0) {
			for (const board of page.objects) {
				const boardDirPath = path.join(
					process.cwd(),
					this.configService.getOrThrow<string>(
						'KAMINARI_ASSETS_PUBLIC_DIR'
					),
					this.configService.getOrThrow<string>('KAMINARI_FILES_DIR'),
					board.url
				);

				listDto.boards.push(
					new BoardDto(
						board,
						await this.commentQueries.getCommentsCount(board.url),
						await this.commentQueries.getFilesCount(board.url),
						filesize(
							await this.fileSystemService.dirSize(boardDirPath),
							{ base: 2, standard: 'jedec' }
						)
					)
				);
			}
		}

		listDto.totalRecords = page.totalCount;
		listDto.previousPageNumber = page.previousPageNumber;
		listDto.nextPageNumber = page.nextPageNumber;

		return listDto;
	}

	/**
	 * Find data for board edition form
	 * @param id Board ID
	 * @return Board form page
	 */
	public async findById(id: string): Promise<BoardFormDto> {
		const board = await this.prisma.board.findFirst({
			where: { id },
			include: { boardSettings: true }
		});

		if (!board) {
			throw new NotFoundException(`Board with id ${id} was not found`);
		}

		const dto = new BoardFormDto();
		dto.isCreationForm = false;
		dto.id = board.id;
		dto.url = board.url;
		dto.name = board.name;
		dto.enablePosting = board.boardSettings.enablePosting;
		dto.enableFilesOnThread = board.boardSettings.enableFilesOnThread;
		dto.enableFilesOnReply = board.boardSettings.enableFilesOnReply;
		dto.strictFileOnThread = board.boardSettings.strictFileOnThread;
		dto.strictFileOnReply = board.boardSettings.strictFileOnReply;
		dto.enableTripcode = board.boardSettings.enableTripcode;
		dto.enableMarkdown = board.boardSettings.enableMarkdown;
		dto.delayBetweenThreads = board.boardSettings.delayBetweenThreads;
		dto.delayBetweenReplies = board.boardSettings.delayBetweenReplies;
		dto.threadKeepAliveTime = board.boardSettings.threadKeepAliveTime;
		dto.bumpLimit = board.boardSettings.bumpLimit;
		dto.strictAnonymousPosting = board.boardSettings.strictAnonymousPosting;
		dto.maxThreadCount = board.boardSettings.maxThreadCount;
		dto.additionalRules = board.boardSettings.additionalRules;
		dto.maxFileSize = board.boardSettings.maxFileSize;
		dto.maxCommentLength = board.boardSettings.maxFileSize;

		return dto;
	}

	/**
	 * Create new board
	 * @param dto Board mutation DTO with normalized types
	 * @return New Board
	 */
	public async create(dto: BoardNormalizedMutationDto): Promise<Board> {
		this.logger.log(logWithObject('Create board', dto));

		this.checkUrlConflict(dto);
		await this.checkUniqueUrlOnCreate(dto);

		const newBoard = await this.prisma.board.create({
			data: {
				url: dto.url,
				name: dto.name,
				boardSettings: {
					create: {
						enablePosting: dto.enablePosting,
						enableFilesOnThread: dto.enableFilesOnThread,
						enableFilesOnReply: dto.enableFilesOnReply,
						strictFileOnThread: dto.strictFileOnThread,
						strictFileOnReply: dto.strictFileOnReply,
						enableTripcode: dto.enableTripcode,
						enableMarkdown: dto.enableMarkdown,
						delayBetweenThreads: dto.delayBetweenThreads,
						delayBetweenReplies: dto.delayBetweenReplies,
						threadKeepAliveTime: dto.threadKeepAliveTime,
						bumpLimit: dto.bumpLimit,
						strictAnonymousPosting: dto.strictAnonymousPosting,
						maxThreadCount: dto.maxThreadCount,
						additionalRules: dto.additionalRules,
						maxFileSize: dto.maxFileSize,
						maxCommentLength: dto.maxFileSize
					}
				}
			}
		});

		const newBoardWithSettings = await this.prisma.board.findFirst({
			where: { id: newBoard.id },
			include: { boardSettings: true }
		});

		this.logger.log(logWithObject('Created board', { id: newBoard.id }));
		this.logger.log(
			logWithObject('Created board settings', {
				id: newBoardWithSettings.boardSettings.id
			})
		);

		return newBoardWithSettings;
	}

	/**
	 * Update board
	 * @param dto Board mutation DTO with normalized types
	 * @param id Board ID
	 * @return Updated Board
	 */
	public async update(
		dto: BoardNormalizedMutationDto,
		id: string
	): Promise<Board> {
		this.logger.log(logWithObject('Update board', dto));

		this.checkUrlConflict(dto);

		const board = await this.prisma.board.findFirst({
			where: { id },
			include: { boardSettings: true }
		});

		if (!board) {
			throw new NotFoundException(`Board with id ${id} was not found`);
		}

		await this.checkUniqueUrlOnUpdate(dto, id);

		const updatedBoard = await this.prisma.board.update({
			where: { id },
			include: { boardSettings: true },
			data: {
				url: dto.url,
				name: dto.name,
				boardSettings: {
					update: {
						enablePosting: dto.enablePosting,
						enableFilesOnThread: dto.enableFilesOnThread,
						enableFilesOnReply: dto.enableFilesOnReply,
						strictFileOnThread: dto.strictFileOnThread,
						strictFileOnReply: dto.strictFileOnReply,
						enableTripcode: dto.enableTripcode,
						enableMarkdown: dto.enableMarkdown,
						delayBetweenThreads: dto.delayBetweenThreads,
						delayBetweenReplies: dto.delayBetweenReplies,
						threadKeepAliveTime: dto.threadKeepAliveTime,
						bumpLimit: dto.bumpLimit,
						strictAnonymousPosting: dto.strictAnonymousPosting,
						maxThreadCount: dto.maxThreadCount,
						additionalRules: dto.additionalRules,
						maxFileSize: dto.maxFileSize,
						maxCommentLength: dto.maxFileSize
					}
				}
			}
		});

		this.logger.log(
			logWithObject('Updated board', { id: updatedBoard.id })
		);
		this.logger.log(
			logWithObject('Updated board settings', {
				id: updatedBoard.boardSettings.id
			})
		);

		return updatedBoard;
	}

	/**
	 * Remove board
	 * @param id Board ID
	 */
	public async remove(id: string): Promise<void> {
		this.logger.log(logWithObject('Remove board', { id }));

		const comments = await this.prisma.comment.findMany({
			include: { board: true },
			where: { board: { id } }
		});

		await this.commentRemoveCommand.removeComments(comments);

		const board = await this.prisma.board.findFirst({
			where: { id },
			include: { boardSettings: true }
		});

		if (!board) {
			throw new NotFoundException(`Board with id ${id} was not found`);
		}

		await this.prisma.boardSettings.delete({
			where: { id: board.boardSettings.id }
		});
		await this.prisma.board.delete({ where: { id: board.id } });

		const boardDirPath = path.join(
			process.cwd(),
			this.configService.getOrThrow<string>('KAMINARI_ASSETS_PUBLIC_DIR'),
			this.configService.getOrThrow<string>('KAMINARI_FILES_DIR'),
			board.url
		);

		await this.fileSystemService.removePath(boardDirPath);

		this.logger.log(logWithObject('Removed board', { id }));
	}

	private checkUrlConflict(dto: BoardNormalizedMutationDto): void {
		if (this.systemReservedUrls.indexOf(dto.url) !== -1) {
			this.logger.log(
				logWithObject('Conflicted URL has been written', {
					url: dto.url
				})
			);

			throw new ConflictException(
				`URL "${dto.url}" is reserved by system. Please write another URL.`
			);
		}
	}

	private async checkUniqueUrlOnCreate(
		dto: BoardNormalizedMutationDto
	): Promise<void> {
		const board = await this.prisma.board.findFirst({
			where: { url: dto.url }
		});

		if (board) {
			throw new ConflictException(
				`Board with URL ${dto.url} already exists`
			);
		}
	}

	private async checkUniqueUrlOnUpdate(
		dto: BoardNormalizedMutationDto,
		id: string
	): Promise<void> {
		const board = await this.prisma.board.findFirst({
			where: { url: dto.url }
		});

		if (board) {
			if (board.id !== id) {
				throw new ConflictException(
					`Board with URL ${dto.url} already exists`
				);
			}
		}
	}
}

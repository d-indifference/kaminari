import { Injectable, Logger } from '@nestjs/common';
import { FileSystemService, PrismaService } from '@toolkit/services';
import { ConfigService } from '@nestjs/config';
import { Board, Comment, Prisma } from '@prisma/client';
import { CommentSaveDto } from '@comments/dto';
import * as path from 'path';
import * as process from 'process';
import * as sharp from 'sharp';
import * as fsExtra from 'fs-extra';
import * as imageSize from 'image-size';
import * as fs from 'fs/promises';
import { logWithObject } from '@toolkit/log-with-object';

/**
 * Creation service for Comments
 */
@Injectable()
export class CommentCreateCommand {
	private readonly logger = new Logger(CommentCreateCommand.name);

	constructor(
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService,
		private readonly fileSystemService: FileSystemService
	) {}

	/**
	 * Create new thread
	 * @param url Board URL
	 * @param dto New thread DTO
	 * @return New comment entity
	 */
	public async createThread(
		url: string,
		dto: CommentSaveDto
	): Promise<Comment> {
		this.logger.log(
			logWithObject(`Create new thread on ${url} board`, dto)
		);

		const board = await this.prisma.board.findFirst({
			where: { url }
		});

		const creationArgs: Prisma.CommentCreateArgs = {
			data: {
				board: { connect: board },
				posterIp: dto.posterIp,
				numberOnBoard: board.lastPostNumber + 1,
				tripcode: dto.tripcode,
				name: dto.name,
				email: dto.email,
				subject: dto.subject,
				comment: dto.comment,
				password: dto.password,
				lastHit: new Date(),
				...(await this.processFileSaving(board.url, dto))
			},
			include: { board: true }
		};

		const newThread = await this.prisma.comment.create(creationArgs);

		this.logger.log(
			logWithObject(`Created new thread on ${board.url} board`, newThread)
		);

		await this.incrementCommentNumber(board);

		return newThread;
	}

	/**
	 * Create new thread reply
	 * @param url Board URL
	 * @param numberOnBoard number of parent comment
	 * @param dto New thread DTO
	 * @return New comment entity
	 */
	public async createReply(
		url: string,
		numberOnBoard: number,
		dto: CommentSaveDto
	): Promise<Comment> {
		this.logger.log(
			logWithObject(
				`Create new reply on ${url}/res/${numberOnBoard}`,
				dto
			)
		);

		const board = await this.prisma.board.findFirst({
			where: { url }
		});

		const thread = await this.prisma.comment.findFirst({
			where: { board: { url }, numberOnBoard },
			include: { board: true }
		});

		const creationArgs: Prisma.CommentCreateArgs = {
			data: {
				board: { connect: board },
				parent: { connect: thread },
				posterIp: dto.posterIp,
				numberOnBoard: board.lastPostNumber + 1,
				tripcode: dto.tripcode,
				name: dto.name,
				email: dto.email,
				subject: dto.subject,
				comment: dto.comment,
				password: dto.password,
				lastHit: null,
				...(await this.processFileSaving(board.url, dto))
			},
			include: { board: true }
		};

		const newReply = await this.prisma.comment.create(creationArgs);

		this.logger.log(
			logWithObject(`Created new reply on ${board.url} board`, newReply)
		);

		await this.incrementCommentNumber(board);

		return newReply;
	}

	private async incrementCommentNumber(board: Board): Promise<void> {
		this.logger.log(
			logWithObject('Increment last post number', {
				id: board.id,
				lastPostNumber: board.lastPostNumber
			})
		);

		await this.prisma.board.update({
			data: { lastPostNumber: board.lastPostNumber + 1 },
			where: { id: board.id }
		});

		this.logger.log(
			logWithObject('Incremented last post number', {
				id: board.id
			})
		);
	}

	private async processFileSaving(
		url: string,
		dto: CommentSaveDto
	): Promise<Pick<Comment, 'file' | 'fileSize' | 'fileThumb'>> {
		if (!dto.file) {
			this.logger.log('File will not be saved, file is empty');

			return {
				file: null,
				fileSize: null,
				fileThumb: null
			};
		}

		this.logger.log(
			logWithObject('Try to save a file', { file: dto.file.path })
		);

		this.logger.log(
			logWithObject('File will be saved', { file: dto.file.path })
		);

		const pathToFiles = path.join(
			process.cwd(),
			this.configService.getOrThrow<string>('KAMINARI_ASSETS_PUBLIC_DIR'),
			this.configService.getOrThrow<string>('KAMINARI_FILES_DIR'),
			url
		);

		const pathToSrc = path.join(pathToFiles, 'src');
		const pathToThumb = path.join(pathToFiles, 'thumb');

		const fullSrcFilePath = await this.fileSystemService.saveFileFromForm(
			pathToSrc,
			dto.file,
			`${Date.now()}`
		);

		this.logger.log(
			logWithObject('File has been saved', { file: fullSrcFilePath })
		);

		const fileThumb = await this.makeThumbnail(
			fullSrcFilePath,
			pathToThumb
		);

		this.logger.log(
			logWithObject('File thumbnail has been saved', { file: fileThumb })
		);

		const fileStats = await fs.stat(fullSrcFilePath);

		return {
			file: path.basename(fullSrcFilePath),
			fileSize: fileStats.size,
			fileThumb
		};
	}

	private async makeThumbnail(
		srcFilePath: string,
		pathToThumb: string
	): Promise<string> {
		const thumbnailHeight = 200;

		const thumbName = path.basename(srcFilePath);
		const srcDimensions = imageSize.imageSize(srcFilePath);

		if (srcDimensions.height > 200) {
			await fsExtra.ensureDir(pathToThumb);

			await sharp(srcFilePath)
				.resize(
					Math.floor(
						(srcDimensions.width * thumbnailHeight) /
							srcDimensions.height
					),
					thumbnailHeight
				)
				.toFile(path.join(pathToThumb, thumbName));
		} else {
			await fsExtra.copyFile(
				srcFilePath,
				path.join(pathToThumb, thumbName)
			);
		}

		return thumbName;
	}
}

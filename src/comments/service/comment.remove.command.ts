import { Injectable, Logger } from '@nestjs/common';
import { FileSystemService, PrismaService } from '@toolkit/services';
import { ConfigService } from '@nestjs/config';
import { Comment } from '@prisma/client';
import { logWithObject } from '@toolkit/log-with-object';
import * as path from 'path';
import * as process from 'process';

/**
 * Deletion service for Comments
 */
@Injectable()
export class CommentRemoveCommand {
	private readonly logger = new Logger(CommentRemoveCommand.name);

	constructor(
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService,
		private readonly fileSystemService: FileSystemService
	) {}

	/**
	 * Clear file comment's file if file exists
	 * @param comment Comment entity
	 */
	public async clearFile(comment: Comment): Promise<void> {
		this.logger.log(
			logWithObject('Clear file from comment', {
				id: comment.id,
				file: comment.file
			})
		);

		if (comment.file) {
			await this.clearFileFromDisk(comment);

			await this.prisma.comment.update({
				data: { file: null, fileThumb: null },
				where: { id: comment.id }
			});

			this.logger.log(
				logWithObject('File was cleared', {
					id: comment.id,
					file: comment.file
				})
			);
		} else {
			this.logger.log('Comment does not contain any file');
		}
	}

	/**
	 * Clear file comments' file if file exists
	 * @param comments Comment entities
	 */
	public async clearFiles(comments: Comment[]): Promise<void> {
		for (const comment of comments) {
			await this.clearFile(comment);
		}
	}

	/**
	 * Remove comment
	 * @param comment Comment entity
	 */
	public async removeComment(comment: Comment): Promise<void> {
		this.logger.log(
			logWithObject('Comment will be removed', {
				id: comment.id
			})
		);

		await this.clearFile(comment);

		await this.prisma.comment.delete({
			where: { id: comment.id }
		});

		this.logger.log(
			logWithObject('Comment has been removed', {
				id: comment.id
			})
		);
	}

	/**
	 * Remove comments
	 * @param comments Comment entities
	 */
	public async removeComments(comments: Comment[]): Promise<void> {
		for (const comment of comments) {
			await this.removeComment(comment);
		}
	}

	/**
	 * Remove orphaned comments (reply comments without parent comment)
	 */
	public async removeOrphanedComments(): Promise<void> {
		const orphanedComments = await this.prisma.comment.findMany({
			where: { parent: null, lastHit: null }
		});

		this.logger.log(
			`There are ${orphanedComments.length} orphaned comments were found. They will be removed`
		);

		await this.removeComments(orphanedComments);
	}

	private async clearFileFromDisk(comment: Comment): Promise<void> {
		if (comment) {
			if (comment['board']) {
				const baseFilePath = path.join(
					process.cwd(),
					this.configService.getOrThrow<string>(
						'KAMINARI_ASSETS_PUBLIC_DIR'
					),
					this.configService.getOrThrow<string>('KAMINARI_FILES_DIR'),
					comment['board'].url
				);

				const srcFilePath = path.join(baseFilePath, 'src');
				const thumbFilePath = path.join(baseFilePath, 'thumb');

				await this.fileSystemService.removePaths([
					path.join(srcFilePath, comment.file),
					path.join(thumbFilePath, comment.fileThumb)
				]);
			}
		}
	}
}

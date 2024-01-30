import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@toolkit/services';
import { logWithObject } from '@toolkit/log-with-object';
import { Comment } from '@prisma/client';

/**
 * Queries for comment entity
 */
@Injectable()
export class CommentQueries {
	private readonly logger = new Logger(CommentQueries.name);

	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Check if comment exists
	 * @param url Board URL
	 * @param numberOnBoard Number of comment on board
	 * @return `true` if exists, `false` if not exists
	 */
	public async exists(url: string, numberOnBoard: number): Promise<boolean> {
		const comment = await this.prisma.comment.findFirst({
			include: { board: true },
			where: { board: { url }, numberOnBoard }
		});

		return Boolean(comment);
	}

	/**
	 * Check if comment exists or throw 404
	 * @param url Board URL
	 * @param numberOnBoard Number of comment on board
	 */
	public async existsOr404(
		url: string,
		numberOnBoard: number
	): Promise<void> {
		if (!(await this.exists(url, numberOnBoard))) {
			this.logger.log(
				logWithObject('Comment was not found', {
					url,
					numberOnBoard
				})
			);

			throw new NotFoundException(
				`Comment on board /${url}/ with number ${numberOnBoard} was not found`
			);
		}
	}

	/**
	 * Check if comment is opening post
	 * @param url Board URL
	 * @param numberOnBoard Number of comment on board
	 * @return `true` if yes, `false` if no
	 */
	public async isOpeningPost(
		url: string,
		numberOnBoard: number
	): Promise<boolean> {
		await this.existsOr404(url, numberOnBoard);

		const comment = await this.prisma.comment.findFirst({
			include: { board: true },
			where: { board: { url }, numberOnBoard }
		});

		return Boolean(comment.lastHit);
	}

	/**
	 * Get opening post comment with children comments or throw 404
	 * @param url Board URL
	 * @param numberOnBoard Number of comment on board
	 * @return Comment with children comments
	 */
	public async getThread(
		url: string,
		numberOnBoard: number
	): Promise<Comment> {
		await this.existsOr404(url, numberOnBoard);

		return (await this.prisma.comment.findFirst({
			include: { board: true, children: true },
			where: { board: { url }, numberOnBoard }
		})) as Comment;
	}

	public async getThreadCommentsCount(
		url: string,
		numberOnBoard: number
	): Promise<number> {
		await this.existsOr404(url, numberOnBoard);

		return (await this.prisma.comment.count({
			where: { board: { url }, parent: { numberOnBoard } }
		})) as number;
	}

	/**
	 * Get total comments count
	 * @return Total comments count
	 */
	public async getTotalCommentsCount(): Promise<number> {
		return (await this.prisma.comment.count()) as number;
	}

	/**
	 * Get count of comments with files
	 * @return Total comments count
	 */
	public async getTotalFilesCount(): Promise<number> {
		return (await this.prisma.comment.count({
			where: { file: { not: null } }
		})) as number;
	}

	/**
	 * Get count of comments on board by URL
	 * @param url Board URL
	 * @return Comments count on board
	 */
	public async getCommentsCount(url: string): Promise<number> {
		return (await this.prisma.comment.count({
			where: { board: { url } }
		})) as number;
	}

	/**
	 * Get count of comments with files on board by URL
	 * @param url Board URL
	 * @return Comments count on board
	 */
	public async getFilesCount(url: string): Promise<number> {
		return (await this.prisma.comment.count({
			where: { board: { url }, file: { not: null } }
		})) as number;
	}

	/**
	 * Get count of threads on board by URL
	 * @param url Board URL
	 * @return Thread count on board
	 */
	public async getThreadsCount(url: string): Promise<number> {
		return (await this.prisma.comment.count({
			where: { board: { url }, lastHit: { not: null } }
		})) as number;
	}
}

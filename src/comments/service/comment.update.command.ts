import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@toolkit/services';
import { Comment } from '@prisma/client';
import { logWithObject } from '@toolkit/log-with-object';

/**
 * Updating service for Comments
 */
@Injectable()
export class CommentUpdateCommand {
	private readonly logger = new Logger(CommentUpdateCommand.name);

	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Update thread last hit
	 * @param thread Thread opening post comment
	 */
	public async updateLastHit(thread: Comment): Promise<void> {
		this.logger.log(
			logWithObject('Update thread last hit', { id: thread.id })
		);

		await this.prisma.comment.update({
			data: {
				lastHit: new Date()
			},
			where: { id: thread.id }
		});

		this.logger.log(
			logWithObject('Updated thread last hit', { id: thread.id })
		);
	}
}

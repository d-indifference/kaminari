import {
	Body,
	Controller,
	Param,
	ParseIntPipe,
	Post,
	Res,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { RealIP } from 'nestjs-real-ip';
import { Response } from 'express';
import { BoardDeleteCommentsDto, CommentCreateDto } from '@forum/dto';
import {
	ForumCreateService,
	ForumDeleteService,
	CommentValidationService
} from '@forum/services';

/**
 * Forum post tasks controller
 */
@Controller()
export class ForumTasksController {
	constructor(
		private readonly forumCreateService: ForumCreateService,
		private readonly threadValidationService: CommentValidationService,
		private readonly forumDeleteService: ForumDeleteService
	) {}

	/**
	 * Create new thread
	 */
	@Post(':url/kaminari/post')
	@FormDataRequest()
	@UsePipes(new ValidationPipe({ transform: true }))
	public async createThread(
		@Param('url') url: string,
		@RealIP() ip: string,
		@Body() dto: CommentCreateDto,
		@Res() res: Response
	): Promise<void> {
		await this.threadValidationService.validate(url, dto, ip);

		const thread = await this.forumCreateService.createThread(dto, url, ip);

		if (dto.goto === 'board') {
			res.redirect(`/${url}`);
		} else {
			res.redirect(`/${url}/res/${thread.numberOnBoard}`);
		}
	}

	@Post(':url/res/:numberOnBoard/kaminari/post')
	@FormDataRequest()
	@UsePipes(new ValidationPipe({ transform: true }))
	public async createReply(
		@Param('url') url: string,
		@Param('numberOnBoard', ParseIntPipe) numberOnBoard: number,
		@RealIP() ip: string,
		@Body() dto: CommentCreateDto,
		@Res() res: Response
	): Promise<void> {
		await this.threadValidationService.validateReply(
			url,
			numberOnBoard,
			dto,
			ip
		);

		const reply = await this.forumCreateService.createReply(
			dto,
			url,
			numberOnBoard,
			ip
		);

		if (dto.goto === 'board') {
			res.redirect(`/${url}`);
		} else {
			res.redirect(`/${url}/res/${numberOnBoard}#${reply.numberOnBoard}`);
		}
	}

	/**
	 * Delete selected comments
	 */
	@Post(':url/kaminari/delete')
	@FormDataRequest()
	@UsePipes(new ValidationPipe({ transform: true }))
	public async deleteComments(
		@Param('url') url: string,
		@Body() dto: BoardDeleteCommentsDto,
		@Res() res: Response
	): Promise<void> {
		await this.forumDeleteService.deleteComments(url, dto);

		res.redirect(`/${url}`);
	}

	@Post(':url/res/:numberOnBoard/kaminari/delete')
	@FormDataRequest()
	@UsePipes(new ValidationPipe({ transform: true }))
	public async deleteCommentsFromThread(
		@Param('url') url: string,
		@Param('numberOnBoard') numberOnBoard: string,
		@Body() dto: BoardDeleteCommentsDto,
		@Res() res: Response
	): Promise<void> {
		await this.forumDeleteService.deleteComments(url, dto);

		if (typeof dto.delete === 'string') {
			if (dto.delete === numberOnBoard) {
				res.redirect(`/${url}`);
			} else {
				res.redirect(`/${url}/res/${numberOnBoard}`);
			}
		} else {
			const thisThreadDeleteCandidate = dto.delete.filter(
				val => val === numberOnBoard
			);

			if (thisThreadDeleteCandidate.length > 0) {
				res.redirect(`/${url}`);
			} else {
				res.redirect(`/${url}/res/${numberOnBoard}`);
			}
		}
	}
}

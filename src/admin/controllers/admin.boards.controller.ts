import {
	Body,
	Controller,
	Get,
	Param,
	ParseUUIDPipe,
	Post,
	Query,
	Render,
	Res,
	Session,
	UseGuards,
	ValidationPipe
} from '@nestjs/common';
import { SessionGuard } from '@admin/guards';
import { SessionDto } from '@admin/dto/session';
import { HeaderedSessionPageBuilder } from '@toolkit/page-builder';
import { Response } from 'express';
import {
	BoardFormDto,
	BoardListDto,
	BoardNormalizedMutationDto
} from '@admin/dto/boards';
import { AdminBoardsService } from '@admin/services';
import { SettingsService } from '@settings/services';
import { PageNumberPipe } from '@toolkit/pipes';
import { NormalizeBoardMutationDtoPipe } from '@admin/pipes';

/**
 * Admin panel boards management controller
 */
@Controller('admin/boards')
export class AdminBoardsController {
	constructor(
		private readonly settingsService: SettingsService,
		private readonly adminBoardsService: AdminBoardsService
	) {}

	/**
	 * Get board list
	 */
	@Get()
	@UseGuards(SessionGuard)
	@Render('admin-boards-list')
	public async index(
		@Session() session: SessionDto,
		@Query('page', new PageNumberPipe()) page?: number
	): Promise<BoardListDto> {
		const data = await this.adminBoardsService.findAll(page);

		return new HeaderedSessionPageBuilder(data)
			.setSession(session.payload)
			.setHeader(this.settingsService.getHeader())
			.setTitle(this.settingsService.buildPageTitle('Boards'))
			.build();
	}

	/**
	 * Get board creation form
	 */
	@Get('new')
	@UseGuards(SessionGuard)
	@Render('admin-boards-form')
	public getNewBoardForm(@Session() session: SessionDto): BoardFormDto {
		const data = new BoardFormDto();
		data.isCreationForm = true;

		return new HeaderedSessionPageBuilder(data)
			.setSession(session.payload)
			.setHeader(this.settingsService.getHeader())
			.setTitle(this.settingsService.buildPageTitle('New board'))
			.build();
	}

	/**
	 * Get board edit form
	 */
	@Get(':id')
	@UseGuards(SessionGuard)
	@Render('admin-boards-form')
	public async getEditBoardForm(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Session() session: SessionDto
	): Promise<BoardFormDto> {
		const data = await this.adminBoardsService.findById(id);

		return new HeaderedSessionPageBuilder(data)
			.setSession(session.payload)
			.setHeader(this.settingsService.getHeader())
			.setTitle(this.settingsService.buildPageTitle('Edit board'))
			.build();
	}

	/**
	 * Create new board
	 */
	@Post('new')
	@UseGuards(SessionGuard)
	public async createNewBoard(
		@Body(
			new ValidationPipe({ transform: true }),
			new NormalizeBoardMutationDtoPipe()
		)
		dto: BoardNormalizedMutationDto,
		@Res() res: Response
	): Promise<void> {
		const board = await this.adminBoardsService.create(dto);

		res.redirect(`/admin/boards/${board.id}`);
	}

	/**
	 * Update board by ID
	 */
	@Post(':id')
	@UseGuards(SessionGuard)
	public async updateBoard(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body(
			new ValidationPipe({ transform: true }),
			new NormalizeBoardMutationDtoPipe()
		)
		dto: BoardNormalizedMutationDto,
		@Res() res: Response
	): Promise<void> {
		const board = await this.adminBoardsService.update(dto, id);

		res.redirect(`/admin/boards/${board.id}`);
	}

	/**
	 * Delete board
	 */
	@Post(':id/delete')
	@UseGuards(SessionGuard)
	public async removeBoard(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Res() res: Response
	): Promise<void> {
		await this.adminBoardsService.remove(id);

		res.redirect('/admin/boards');
	}
}

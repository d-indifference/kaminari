import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	Render,
	Res,
	Session,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { SessionGuard } from '@admin/guards';
import { SessionDto } from '@admin/dto/session';
import { HeaderedSessionPageBuilder } from '@toolkit/page-builder';
import { Response } from 'express';
import {
	BoardFormDto,
	BoardListDto,
	BoardMutationDto,
	normalizeDto
} from '@admin/dto/boards';
import { AdminBoardsService } from '@admin/services';
import { validateSync } from 'class-validator';

/**
 * Admin panel boards management controller
 */
@Controller('admin/boards')
export class AdminBoardsController {
	constructor(private readonly adminBoardsService: AdminBoardsService) {}

	/**
	 * Get board list
	 */
	@Get()
	@UseGuards(SessionGuard)
	@Render('admin-boards-list')
	public async index(
		@Session() session: SessionDto,
		@Query('page') page?: number
	): Promise<BoardListDto> {
		const data = await this.adminBoardsService.findAll(page ?? 0);

		return new HeaderedSessionPageBuilder(data)
			.setSession(session.payload)
			.setHeader('Kaminari Image board')
			.setTitle('Boards — Kaminari Image Board')
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
			.setHeader('Kaminari Image board')
			.setTitle('New board — Kaminari Image Board')
			.build();
	}

	/**
	 * Get board edit form
	 */
	@Get(':id')
	@UseGuards(SessionGuard)
	@Render('admin-boards-form')
	public async getEditBoardForm(
		@Param('id') id: string,
		@Session() session: SessionDto
	): Promise<BoardFormDto> {
		const data = await this.adminBoardsService.findById(id);

		return new HeaderedSessionPageBuilder(data)
			.setSession(session.payload)
			.setHeader('Kaminari Image board')
			.setTitle('Edit board — Kaminari Image Board')
			.build();
	}

	/**
	 * Create new board
	 */
	@Post('new')
	@UseGuards(SessionGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	public async createNewBoard(
		@Body() dto: BoardMutationDto,
		@Res() res: Response
	): Promise<void> {
		const normalizedDto = normalizeDto(dto);

		const errors = validateSync(normalizedDto);

		if (errors.length > 0) {
			throw new BadRequestException(errors);
		}

		const board = await this.adminBoardsService.create(normalizedDto);

		res.redirect(`/admin/boards/${board.id}`);
	}

	/**
	 * Update board by ID
	 */
	@Post(':id')
	@UseGuards(SessionGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	public async updateBoard(
		@Param('id') id: string,
		@Body() dto: BoardMutationDto,
		@Res() res: Response
	): Promise<void> {
		const normalizedDto = normalizeDto(dto);

		const errors = validateSync(normalizedDto);

		if (errors.length > 0) {
			throw new BadRequestException(errors);
		}

		const board = await this.adminBoardsService.update(normalizedDto, id);

		res.redirect(`/admin/boards/${board.id}`);
	}

	/**
	 * Delete board
	 */
	@Post(':id/delete')
	@UseGuards(SessionGuard)
	public async removeBoard(
		@Param('id') id: string,
		@Res() res: Response
	): Promise<void> {
		await this.adminBoardsService.remove(id);

		res.redirect('/admin/boards');
	}
}

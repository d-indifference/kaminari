import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	Render,
	Req,
	Res,
	Session,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { SessionGuard } from '@admin/guards';
import { HeaderedSessionPageBuilder } from '@toolkit/page-builder';
import { SessionDto } from '@admin/dto/session';
import {
	StaffCreateDto,
	StaffListDto,
	StaffMyProfileDto,
	StaffEmailUpdateDto,
	StaffPageDto,
	StaffUpdateDto,
	StaffPasswordUpdateDto
} from '@admin/dto/staff';
import { Request, Response } from 'express';
import { AdminStaffService } from '@admin/services';

/**
 * Admin panel staff controller
 */
@Controller('admin/staff')
export class AdminStaffController {
	constructor(private readonly adminStaffService: AdminStaffService) {}

	/**
	 * Get staff list
	 */
	@Get()
	@UseGuards(SessionGuard)
	@Render('admin-staff-list')
	public async index(
		@Session() session: SessionDto,
		@Query('page') page?: number
	): Promise<StaffListDto> {
		const data = await this.adminStaffService.findAll(page ?? 0);

		return new HeaderedSessionPageBuilder(data)
			.setSession(session.payload)
			.setHeader('Kaminari Image board')
			.setTitle('Administration Staff — Kaminari Image Board')
			.build();
	}

	/**
	 * Get form for updating authenticated user's profile
	 */
	@Get('me')
	@UseGuards(SessionGuard)
	@Render('admin-staff-form-me')
	public async getEditMyProfileForm(
		@Session() session: SessionDto
	): Promise<StaffMyProfileDto> {
		const data = await this.adminStaffService.getMyProfile(session.payload);

		return new HeaderedSessionPageBuilder(data)
			.setSession(session.payload)
			.setHeader('Kaminari Image board')
			.setTitle('Edit my profile — Kaminari Image Board')
			.build();
	}

	/**
	 * Get form for staff creation
	 */
	@Get('new')
	@UseGuards(SessionGuard)
	@Render('admin-staff-form')
	public getNewStaffForm(@Session() session: SessionDto): StaffPageDto {
		const data = new StaffPageDto();
		data.isCreationForm = true;

		return new HeaderedSessionPageBuilder(data)
			.setSession(session.payload)
			.setHeader('Kaminari Image board')
			.setTitle('New Staff Member — Kaminari Image Board')
			.build();
	}

	/**
	 * Get form for staff edition
	 */
	@Get(':id')
	@UseGuards(SessionGuard)
	@Render('admin-staff-form')
	public async getEditStaffForm(
		@Param('id') id: string,
		@Session() session: SessionDto
	): Promise<StaffPageDto> {
		const data = await this.adminStaffService.getById(id);

		return new HeaderedSessionPageBuilder(data)
			.setSession(session.payload)
			.setHeader('Kaminari Image board')
			.setTitle('Edit Staff Member — Kaminari Image Board')
			.build();
	}

	/**
	 * Update staff email
	 */
	@Post('me/email')
	@UseGuards(SessionGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	public async updateStaffEmail(
		@Req() req: Request,
		@Res() res: Response,
		@Body() dto: StaffEmailUpdateDto
	): Promise<void> {
		await this.adminStaffService.updateEmail(dto, req);

		res.redirect('/admin');
	}

	/**
	 * Update staff password
	 */
	@Post('me/password')
	@UseGuards(SessionGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	public async updateStaffPassword(
		@Res() res: Response,
		@Body() dto: StaffPasswordUpdateDto,
		@Session() session: SessionDto
	): Promise<void> {
		await this.adminStaffService.updatePassword(dto, session.payload);

		res.redirect('/admin');
	}

	/**
	 * Create new staff
	 */
	@Post('new')
	@UseGuards(SessionGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	public async createNewStaff(
		@Body() dto: StaffCreateDto,
		@Res() res: Response
	): Promise<void> {
		const createdUser = await this.adminStaffService.create(dto);

		res.redirect(`/admin/staff/${createdUser.id}`);
	}

	/**
	 * Update staff
	 */
	@Post(':id')
	@UseGuards(SessionGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	public async updateStaff(
		@Param('id') id: string,
		@Body() dto: StaffUpdateDto,
		@Res() res: Response
	): Promise<void> {
		const updatedUser = await this.adminStaffService.update(dto, id);

		res.redirect(`/admin/staff/${updatedUser.id}`);
	}

	/**
	 * Delete staff
	 */
	@Post(':id/delete')
	@UseGuards(SessionGuard)
	public async deleteStaff(
		@Param('id') id: string,
		@Res() res: Response
	): Promise<void> {
		await this.adminStaffService.remove(id);

		res.redirect('/admin/staff');
	}
}

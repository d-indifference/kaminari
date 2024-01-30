import {
	Body,
	Controller,
	Get,
	Param,
	ParseUUIDPipe,
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
import { SettingsService } from '@settings/services';
import { PageNumberPipe } from '@toolkit/pipes';

/**
 * Admin panel staff controller
 */
@Controller('admin/staff')
export class AdminStaffController {
	constructor(
		private readonly settingsService: SettingsService,
		private readonly adminStaffService: AdminStaffService
	) {}

	/**
	 * Get staff list
	 */
	@Get()
	@UseGuards(SessionGuard)
	@Render('admin-staff-list')
	public async index(
		@Session() session: SessionDto,
		@Query('page', new PageNumberPipe()) page?: number
	): Promise<StaffListDto> {
		const data = await this.adminStaffService.findAll(page);

		return new HeaderedSessionPageBuilder(data)
			.setSession(session.payload)
			.setHeader(this.settingsService.getHeader())
			.setTitle(
				this.settingsService.buildPageTitle('Administration Staff')
			)
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
			.setHeader(this.settingsService.getHeader())
			.setTitle(this.settingsService.buildPageTitle('Edit my profile'))
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
			.setHeader(this.settingsService.getHeader())
			.setTitle(this.settingsService.buildPageTitle('New staff member'))
			.build();
	}

	/**
	 * Get form for staff edition
	 */
	@Get(':id')
	@UseGuards(SessionGuard)
	@Render('admin-staff-form')
	public async getEditStaffForm(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Session() session: SessionDto
	): Promise<StaffPageDto> {
		const data = await this.adminStaffService.getById(id);

		return new HeaderedSessionPageBuilder(data)
			.setSession(session.payload)
			.setHeader(this.settingsService.getHeader())
			.setTitle(this.settingsService.buildPageTitle('Edit staff member'))
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
		@Param('id', new ParseUUIDPipe()) id: string,
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
		@Param('id', new ParseUUIDPipe()) id: string,
		@Res() res: Response
	): Promise<void> {
		await this.adminStaffService.remove(id);

		res.redirect('/admin/staff');
	}
}

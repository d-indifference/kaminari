import {
	Body,
	Controller,
	Get,
	Post,
	Render,
	Res,
	Session,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { AdminSettingsService } from '@admin/services';
import { SessionGuard } from '@admin/guards';
import { SessionDto } from '@admin/dto/session';
import { SettingsPageDto } from '@admin/dto';
import { SettingsService } from '@settings/services';
import { SettingsDto } from '@settings/dto';
import { Response } from 'express';

/**
 * Admin panel settings controller
 */
@Controller('admin/settings')
export class AdminSettingsController {
	constructor(
		private readonly adminSettingsService: AdminSettingsService,
		private readonly settingsService: SettingsService
	) {}

	/**
	 * Get settings edit form
	 */
	@Get()
	@UseGuards(SessionGuard)
	@Render('admin-settings-form')
	public getSettings(@Session() session: SessionDto): SettingsPageDto {
		const data = this.adminSettingsService.getSettings();

		const page = new SettingsPageDto();
		page.settings = data;
		page.session = session.payload;
		page.header = this.settingsService.getHeader();
		page.title = this.settingsService.buildPageTitle(
			'Global site settings'
		);

		return page;
	}

	/**
	 * Settings edit form handler
	 */
	@Post()
	@UseGuards(SessionGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	public async updateSettings(
		@Body() dto: SettingsDto,
		@Res() res: Response
	): Promise<void> {
		await this.adminSettingsService.update(dto);

		res.redirect('/admin/settings');
	}
}

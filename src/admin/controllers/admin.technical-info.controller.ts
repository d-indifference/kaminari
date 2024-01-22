import {
	Controller,
	Get,
	Render,
	Req,
	Session,
	UseGuards
} from '@nestjs/common';
import { SessionGuard } from '@admin/guards';
import { TechnicalInfoDto } from '@admin/dto';
import { AdminTechnicalInfoService } from '@admin/services';
import { SessionDto } from '@admin/dto/session';
import { Request } from 'express';
import { HeaderedSessionPageBuilder } from '@toolkit/page-builder';
import { SettingsService } from '@settings/services';

/**
 * Admin panel authentication controller
 */
@Controller('admin/technical')
export class AdminTechnicalInfoController {
	constructor(
		private readonly adminTechnicalInfoService: AdminTechnicalInfoService,
		private readonly settingsService: SettingsService
	) {}

	/**
	 * Get technical info about site
	 */
	@Get()
	@UseGuards(SessionGuard)
	@Render('admin-technical-info')
	public async index(
		@Req() req: Request,
		@Session() session: SessionDto
	): Promise<TechnicalInfoDto> {
		return new HeaderedSessionPageBuilder(
			await this.adminTechnicalInfoService.getTechnicalInfo(req, session)
		)
			.setSession(session.payload)
			.setHeader(this.settingsService.getHeader())
			.setTitle(this.settingsService.buildPageTitle('Technical Info'))
			.build();
	}
}

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

/**
 * Admin panel authentication controller
 */
@Controller('admin/technical')
export class AdminTechnicalInfoController {
	constructor(
		private readonly adminTechnicalInfoService: AdminTechnicalInfoService
	) {}

	@Get()
	@UseGuards(SessionGuard)
	@Render('admin-technical-info')
	public index(
		@Req() req: Request,
		@Session() session: SessionDto
	): TechnicalInfoDto {
		return new HeaderedSessionPageBuilder(
			this.adminTechnicalInfoService.getTechnicalInfo(req, session)
		)
			.setSession(session.payload)
			.setHeader('Kaminari Image Board')
			.setTitle('Technical Info — Kaminari Image Board')
			.build();
	}
}

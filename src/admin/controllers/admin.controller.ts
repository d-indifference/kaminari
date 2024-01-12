import {
	Body,
	Controller,
	Get,
	Post,
	Render,
	Req,
	Res,
	Session,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { SignInDto } from '@admin/dto';
import { SessionDto } from '@admin/dto/session';
import { AdminSignInService } from '@admin/services';
import { Request, Response } from 'express';
import { SessionGuard, SignInPageGuard } from '@admin/guards';

/**
 * Admin panel authentication controller
 */
@Controller('admin')
export class AdminController {
	constructor(private readonly adminSignInService: AdminSignInService) {}

	/**
	 * Start admin panel page
	 */
	@Get()
	@UseGuards(SessionGuard)
	@Render('admin-index')
	public index(): unknown {
		return {};
	}

	/**
	 * Sign in page
	 */
	@Get('sign-in')
	@UseGuards(SignInPageGuard)
	@Render('sign-in')
	public getSignIn(): unknown {
		return {};
	}

	/**
	 * Sign out handler
	 */
	@Get('sign-out')
	public signOut(@Req() req: Request, @Res() res: Response): void {
		this.adminSignInService.signOut(req, res);
	}

	/**
	 * Sign in handler
	 */
	@Post('sign-in')
	@FormDataRequest()
	@UsePipes(new ValidationPipe({ transform: true }))
	public async signIn(
		@Body() body: SignInDto,
		@Session() session: SessionDto,
		@Res() res: Response
	): Promise<void> {
		await this.adminSignInService.signIn(body, session, res);
	}
}

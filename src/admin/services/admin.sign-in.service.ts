import {
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from '@toolkit/services';
import { SignInDto } from '@admin/dto';
import { SessionDto, SessionPayloadDto } from '@admin/dto/session';
import { CryptoUtils } from '@toolkit/crypto-utils';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { logWithObject } from '@toolkit/log-with-object';

/**
 * Sign in service for administration panel
 */
@Injectable()
export class AdminSignInService {
	private readonly logger = new Logger(AdminSignInService.name);

	constructor(
		private readonly configService: ConfigService,
		private readonly prisma: PrismaService
	) {}

	/**
	 * Sign in handler
	 * @param body Sign in form data
	 * @param session Session data
	 * @param res Express.js response
	 */
	public async signIn(
		body: SignInDto,
		session: SessionDto,
		res: Response
	): Promise<void> {
		this.logger.log(logWithObject('Sign in', body));

		session.payload = await this.getSessionData(body);

		res.redirect('/admin');
	}

	/**
	 * Sign out handler
	 * @param req Express.js request
	 * @param res Express.js response
	 */
	public signOut(req: Request, res: Response): void {
		this.logger.log(`Sign out ${req.session['payload']['email']}`);

		req.session.destroy(err => {
			if (err) {
				this.logger.error(err.message());
				throw new InternalServerErrorException(err);
			}
		});

		res.redirect('/admin/sign-in');
	}

	private async getSessionData(dto: SignInDto): Promise<SessionPayloadDto> {
		this.logger.log(logWithObject('Get session payload data', dto));

		const crypto = new CryptoUtils(
			this.configService.getOrThrow<string>('KAMINARI_PRIVATE_KEY')
		);

		const foundUser = await this.prisma.user.findFirst({
			where: { email: dto.email }
		});

		if (!foundUser) {
			this.logger.log(logWithObject('User cannot be signed in', dto));

			throw new UnauthorizedException();
		}

		const decryptedPassword = crypto.decrypt(foundUser.encryptedPassword);

		if (decryptedPassword !== dto.password) {
			this.logger.log(
				logWithObject(
					'User cannot be signed in: password is wrong',
					dto
				)
			);

			throw new UnauthorizedException();
		}

		this.logger.log(logWithObject('User can be signed in', dto));

		const sessionPayload = new SessionPayloadDto();
		sessionPayload.email = foundUser.email;
		sessionPayload.role = foundUser.role;

		return sessionPayload;
	}
}

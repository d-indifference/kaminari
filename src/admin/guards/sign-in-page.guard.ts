import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '@toolkit/services';
import { SessionDto } from '@admin/dto/session';

/**
 * Guard for sign in page
 */
@Injectable()
export class SignInPageGuard implements CanActivate {
	constructor(private readonly prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		const res = context.switchToHttp().getResponse();

		const session = req.session as SessionDto;

		if (session.payload !== undefined) {
			const user = await this.prisma.user.findFirst({
				where: { email: session.payload.email }
			});

			if (user) {
				res.redirect('/admin');
			} else {
				return true;
			}
		} else {
			return true;
		}
	}
}

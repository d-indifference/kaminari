import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	Logger,
	UnauthorizedException
} from '@nestjs/common';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(UnauthorizedExceptionFilter.name);

	public catch(exception: UnauthorizedException, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		this.logger.log(this, '[401] Unauthorized');

		response.render('error', {
			title: '401 Unauthorized',
			header: 'Unauthorized',
			imgPath: '/img/401.webp',
			message: exception.message
		});
	}
}

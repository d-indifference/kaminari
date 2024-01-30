import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	ForbiddenException,
	Logger
} from '@nestjs/common';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(ForbiddenExceptionFilter.name);

	public catch(exception: ForbiddenException, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		this.logger.log('[403] Forbidden');

		response.render('error', {
			title: '403 Forbidden',
			header: 'Forbidden',
			imgPath: '/img/403.webp',
			message: exception.message
		});
	}
}

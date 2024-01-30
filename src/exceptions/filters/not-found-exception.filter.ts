import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	Logger,
	NotFoundException
} from '@nestjs/common';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(NotFoundExceptionFilter.name);

	public catch(exception: NotFoundException, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		this.logger.log('[404] Not found');

		response.render('error', {
			title: '404 Not found',
			header: 'Page was not found :(',
			imgPath: '/img/404.webp',
			message: exception.message
		});
	}
}

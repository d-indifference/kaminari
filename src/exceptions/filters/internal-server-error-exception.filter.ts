import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	InternalServerErrorException,
	Logger
} from '@nestjs/common';

@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(
		InternalServerErrorExceptionFilter.name
	);

	public catch(
		exception: InternalServerErrorException,
		host: ArgumentsHost
	): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		this.logger.error('[500] Internal server error');

		response.render('error', {
			title: '500 Internal Server Error',
			header: 'Internal Server Error',
			imgPath: '/img/500.webp',
			message: exception.message
		});
	}
}

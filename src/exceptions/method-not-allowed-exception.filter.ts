import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	Logger,
	MethodNotAllowedException
} from '@nestjs/common';

@Catch(MethodNotAllowedException)
export class MethodNotAllowedExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(MethodNotAllowedExceptionFilter.name);

	public catch(
		exception: MethodNotAllowedException,
		host: ArgumentsHost
	): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		this.logger.log('[405] Method Not Allowed');

		response.render('error', {
			title: '405 Method Not Allowed',
			header: 'Method Not Allowed',
			imgPath: null,
			message: exception.message
		});
	}
}

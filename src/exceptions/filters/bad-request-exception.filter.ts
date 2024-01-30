import {
	ArgumentsHost,
	BadRequestException,
	Catch,
	Logger
} from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestExceptionFilter {
	private readonly logger = new Logger(BadRequestExceptionFilter.name);

	public catch(exception: BadRequestException, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		this.logger.log('[400] Bad request');
		this.logger.log(exception.message);
		console.log(exception.stack);

		response.render('error', {
			title: '400 Bad request',
			header: 'Bad request',
			imgPath: null,
			message: exception.message
		});
	}
}

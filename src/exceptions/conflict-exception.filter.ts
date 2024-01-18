import {
	ArgumentsHost,
	Catch,
	ConflictException,
	ExceptionFilter,
	Logger
} from '@nestjs/common';

@Catch(ConflictException)
export class ConflictExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(ConflictExceptionFilter.name);

	public catch(exception: ConflictException, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		this.logger.log('[409] Conflict');

		response.render('error', {
			title: '409 Conflict',
			header: 'Conflict',
			imgPath: null,
			message: exception.message
		});
	}
}

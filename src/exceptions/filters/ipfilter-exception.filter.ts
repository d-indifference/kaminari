import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	Logger
} from '@nestjs/common';
import { IpFilterDenyException } from 'nestjs-ip-filter';
import { Request, Response } from 'express';

@Catch(IpFilterDenyException)
export class IpFilterDenyExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(IpFilterDenyExceptionFilter.name);

	public catch(exception: HttpException, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const statusFromIpFilter = exception.getStatus();
		const responseFromIpFilter = exception.getResponse();

		this.logger.warn(`Client IP is "${responseFromIpFilter['clientIp']}"`);

		response.status(statusFromIpFilter).json({
			statusCode: statusFromIpFilter,
			timestamp: new Date().toISOString(),
			ipFilterData: responseFromIpFilter,
			path: request.url
		});
	}
}

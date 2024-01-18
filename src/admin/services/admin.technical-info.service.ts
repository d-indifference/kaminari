import { Injectable, Logger } from '@nestjs/common';
import { TechnicalInfoDto } from '@admin/dto';
import * as osInfo from 'os';
import { filesize } from 'filesize';
import { SessionDto } from '@admin/dto/session';
import { Request } from 'express';
import { PrismaService } from '@toolkit/services';
import { Prisma } from '@prisma/client';

/**
 * Admin technical information service
 */
@Injectable()
export class AdminTechnicalInfoService {
	private readonly logger = new Logger(AdminTechnicalInfoService.name);

	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Get technical information
	 * @param req Express.js request
	 * @param session Current session
	 * @return Technical information page
	 */
	public async getTechnicalInfo(
		req: Request,
		session: SessionDto
	): Promise<TechnicalInfoDto> {
		const totalBoards = await this.prisma.board.count();

		const technicalInfo = new TechnicalInfoDto();
		technicalInfo.diskSpaceUsed = '0 MB';
		technicalInfo.totalPosts = 0;
		technicalInfo.totalBoards = totalBoards;
		technicalInfo.cpus = osInfo.cpus();
		technicalInfo.uptime = osInfo.uptime();

		const totalmem = osInfo.totalmem();
		const freeMem = osInfo.freemem();

		technicalInfo.memory = {
			total: filesize(totalmem, { base: 2, standard: 'jedec' }),
			free: filesize(freeMem, { base: 2, standard: 'jedec' }),
			inUsage: filesize(totalmem - freeMem, {
				base: 2,
				standard: 'jedec'
			})
		};

		technicalInfo.port = parseInt(req.headers.host.split(':')[1]);
		technicalInfo.debugPort = process.debugPort;

		technicalInfo.host = osInfo.hostname();
		technicalInfo.processVersions = process.versions;
		technicalInfo.currentSession = session.payload;
		technicalInfo.postgresVersion = await this.getPostgresVersion();

		return technicalInfo;
	}

	private async getPostgresVersion(): Promise<string> {
		this.logger.log(this, 'Get postgres version');

		const postgresVersionQuery = await this.prisma.$queryRaw(
			Prisma.sql`SELECT VERSION();`
		);

		return postgresVersionQuery[0]['version'];
	}
}

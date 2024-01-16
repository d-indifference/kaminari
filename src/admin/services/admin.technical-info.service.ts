import { Injectable } from '@nestjs/common';
import { TechnicalInfoDto } from '@admin/dto';
import * as osInfo from 'os';
import { filesize } from 'filesize';
import { ConfigService } from '@nestjs/config';
import { SessionDto } from '@admin/dto/session';
import { Request } from 'express';

@Injectable()
export class AdminTechnicalInfoService {
	constructor(private readonly configService: ConfigService) {}

	public getTechnicalInfo(
		req: Request,
		session: SessionDto
	): TechnicalInfoDto {
		const technicalInfo = new TechnicalInfoDto();
		technicalInfo.diskSpaceUsed = '0 MB';
		technicalInfo.totalPosts = 0;
		technicalInfo.totalBoards = 0;
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

		return technicalInfo;
	}
}

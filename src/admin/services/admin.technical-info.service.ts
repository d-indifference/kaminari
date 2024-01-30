import { Injectable, Logger } from '@nestjs/common';
import { TechnicalInfoDto } from '@admin/dto';
import * as osInfo from 'os';
import { filesize } from 'filesize';
import { SessionDto } from '@admin/dto/session';
import { Request } from 'express';
import { FileSystemService, PrismaService } from '@toolkit/services';
import { Prisma } from '@prisma/client';
import { AdminDependenciesService } from '@admin/services/admin.dependencies.service';
import { CommentQueries } from '@comments/service';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import * as process from 'process';

/**
 * Admin technical information service
 */
@Injectable()
export class AdminTechnicalInfoService {
	private readonly logger = new Logger(AdminTechnicalInfoService.name);

	constructor(
		private readonly prisma: PrismaService,
		private readonly adminDependenciesService: AdminDependenciesService,
		private readonly commentQueries: CommentQueries,
		private readonly fileSystemService: FileSystemService,
		private readonly configService: ConfigService
	) {}

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
		const totalPosts = await this.commentQueries.getTotalCommentsCount();

		const fileDir = path.join(
			process.cwd(),
			this.configService.getOrThrow<string>('KAMINARI_ASSETS_PUBLIC_DIR'),
			this.configService.getOrThrow<string>('KAMINARI_FILES_DIR')
		);

		const technicalInfo = new TechnicalInfoDto();
		technicalInfo.diskSpaceUsed = filesize(
			await this.fileSystemService.dirSize(fileDir),
			{ base: 2, standard: 'jedec' }
		);
		technicalInfo.totalPosts = totalPosts;
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

		const dependenciesHashes =
			await this.adminDependenciesService.getDependencies();
		technicalInfo.dependencies = dependenciesHashes.dependencies;
		technicalInfo.devDependencies = dependenciesHashes.devDependencies;

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

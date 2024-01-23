import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@toolkit/services';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { logWithObject } from '@toolkit/log-with-object';

@Injectable()
export class MigratorService {
	private readonly logger = new Logger(MigratorService.name);

	constructor(
		private readonly configService: ConfigService,
		private readonly prisma: PrismaService
	) {}

	public async connectToDb(): Promise<boolean> {
		while (true) {
			const dbState = await this.isDatabaseAlive();

			if (dbState) {
				this.logger.log('Successfully connected to database');
				break;
			}

			this.logger.log('Connecting to database...');
		}

		return true;
	}

	/**
	 * Run Prisma migrations exactly
	 */
	public async runPrismaMigrations(): Promise<void> {
		this.logger.log('Checking database migrations...');

		const needToFirstTimeMigrate = await this.isNeedToFirstTimeMigrate();

		if (needToFirstTimeMigrate) {
			this.logger.log(
				'Database migrations will be applied at first time'
			);

			await this.promisifyProcess('npm run migrate:deploy');
		} else {
			const availableMigrationsCount =
				await this.getAvailableMigrationsCount();
			const appliedMigrationsCount =
				await this.getAppliedMigrationsCount();

			if (availableMigrationsCount > appliedMigrationsCount) {
				this.logger.log('New database migrations will be applied');

				await this.promisifyProcess('npm run migrate:deploy');
			} else {
				this.logger.log('All database migrations are up to date');
			}
		}
	}

	public isMigrationSkipped(): boolean {
		return Boolean(
			Number(
				this.configService.getOrThrow<number>(
					'KAMINARI_SKIP_DB_MIGRATION'
				)
			)
		);
	}

	private async isDatabaseAlive(): Promise<boolean> {
		try {
			const result = await this.prisma.$queryRaw(Prisma.sql`SELECT 1`);

			return Boolean(result);
		} catch (e) {
			this.logger.error(e.message.trim());

			return false;
		}
	}

	/**
	 * Get applied in DB migrations count
	 */
	private async getAppliedMigrationsCount(): Promise<number> {
		const migrationsCount = await this.prisma.$queryRaw(
			Prisma.sql`SELECT COUNT(*) as "migrationsCount" FROM _prisma_migrations;`
		);

		return Number(migrationsCount[0].migrationsCount);
	}

	/**
	 * Get all available migrations count
	 */
	private async getAvailableMigrationsCount(): Promise<number> {
		const migrationsPath = path.join(process.cwd(), 'prisma', 'migrations');
		return (await fs.readdir(migrationsPath)).length - 1;
	}

	/**
	 * Check if first migration is needed
	 */
	private async isNeedToFirstTimeMigrate(): Promise<boolean> {
		const exists = await this.prisma.$queryRaw(Prisma.sql`
			SELECT EXISTS (
				SELECT FROM 
					pg_tables
				WHERE 
					schemaname = 'public' AND 
					tablename  = '_prisma_migrations'
			);`);

		return !exists[0].exists;
	}

	/**
	 * Run command and get its result as promise
	 * @param command Shell command
	 */
	private promisifyProcessNoOutput(command: string): Promise<string> {
		this.logger.log(logWithObject('Run process...', { command }));
		return new Promise((resolve, reject) => {
			exec(command, (error, stdout, stderr) => {
				if (error) {
					reject(error);
				} else {
					console.error(stderr.trim());
					resolve(stdout.trim());
				}
			});
		});
	}

	/**
	 * Run command as promise and print its result
	 * @param command Shell command
	 */
	private promisifyProcess(command: string): Promise<void> {
		this.logger.log(logWithObject('Run process...', { command }));
		return new Promise((resolve, reject) => {
			this.promisifyProcessNoOutput(command)
				.then(result => {
					console.log(result);
					resolve(null);
				})
				.catch(e => {
					console.error(e.message);
					reject(e);
				});
		});
	}
}

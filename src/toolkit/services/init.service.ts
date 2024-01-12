import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';
import { CryptoUtils } from '@toolkit/crypto-utils';

@Injectable()
export class InitService {
	private readonly logger = new Logger(InitService.name);

	constructor(
		private readonly prisma: PrismaService,
		private readonly config: ConfigService
	) {}

	public async initRootUser(): Promise<void> {
		const skipRootUser = this.config.getOrThrow<boolean>(
			'KAMINARI_SKIP_ROOT_USER_CREATION'
		);

		if (!skipRootUser) {
			const userCount = await this.prisma.user.count();

			if (userCount === 0) {
				await this.createRootUser();
			} else {
				this.logger.log('There are already users in the database');
			}
		} else {
			this.logger.log('Root user creation skipped');
		}
	}

	private async createRootUser(): Promise<void> {
		const rootUserEmail = this.config.getOrThrow<string>(
			'KAMINARI_ROOT_USER_EMAIL'
		);

		const rootUserPassword = this.config.getOrThrow<string>(
			'KAMINARI_ROOT_USER_PASSWORD'
		);

		const crypto = new CryptoUtils(
			this.config.getOrThrow<string>('KAMINARI_PRIVATE_KEY')
		);

		const newRootUser = await this.prisma.user.create({
			data: {
				email: rootUserEmail,
				encryptedPassword: crypto.encrypt(rootUserPassword),
				role: UserRole.ADMIN
			}
		});

		this.logger.log(
			`Root user with id: '${newRootUser.id}' was successfully created`
		);
	}
}

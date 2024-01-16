import {
	ConflictException,
	Injectable,
	Logger,
	MethodNotAllowedException,
	NotFoundException
} from '@nestjs/common';
import { PrismaService } from '@toolkit/services';
import {
	StaffCreateDto,
	StaffListDto,
	StaffPageDto,
	StaffDto,
	StaffUpdateDto,
	StaffMyProfileDto,
	StaffEmailUpdateDto,
	StaffPasswordUpdateDto
} from '@admin/dto/staff';
import { User, UserRole } from '@prisma/client';
import { logWithObject } from '@toolkit/log-with-object';
import { CryptoUtils } from '@toolkit/crypto-utils';
import { ConfigService } from '@nestjs/config';
import { PrismaPaginator } from '@toolkit/prisma-paginator';
import { SessionPayloadDto } from '@admin/dto/session';
import { Request } from 'express';

@Injectable()
export class AdminStaffService {
	private readonly logger = new Logger(AdminStaffService.name);

	constructor(
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService
	) {}

	public async findAll(pageNumber = 0): Promise<StaffListDto> {
		const pageSize = 10;

		const listDto = new StaffListDto();

		const paginator = new PrismaPaginator(this.prisma, 'user');

		const page = await paginator.pageRequest<User>(pageNumber, pageSize);

		listDto.staff = page.objects.map(
			user => new StaffDto(user.id, user.email, user.role)
		);
		listDto.totalRecords = page.totalCount;
		listDto.previousPageNumber = page.previousPageNumber;
		listDto.nextPageNumber = page.nextPageNumber;

		return listDto;
	}

	public async getById(id: string): Promise<StaffPageDto> {
		const user = await this.prisma.user.findFirst({
			where: { id }
		});

		if (!user) {
			throw new NotFoundException(`User with id ${id} was not found`);
		}

		const page = new StaffPageDto();
		page.id = user.id;
		page.email = user.email;
		page.role = user.role;
		page.isCreationForm = false;

		return page;
	}

	public async getMyProfile(
		session: SessionPayloadDto
	): Promise<StaffMyProfileDto> {
		const profileDto = new StaffMyProfileDto();

		const user = await this.prisma.user.findFirst({
			where: { email: session.email }
		});

		profileDto.email = user.email;

		return profileDto;
	}

	public async create(dto: StaffCreateDto): Promise<User> {
		this.logger.log(logWithObject('Create new user', dto));

		await this.checkExistingEmail(dto);

		const crypto = new CryptoUtils(
			this.configService.getOrThrow<string>('KAMINARI_PRIVATE_KEY')
		);

		const newUser = await this.prisma.user.create({
			data: {
				email: dto.email,
				encryptedPassword: crypto.encrypt(dto.password),
				role: UserRole[dto.role]
			}
		});

		this.logger.log(logWithObject('Created user', { id: newUser.id }));

		return newUser;
	}

	public async update(dto: StaffUpdateDto, id: string): Promise<User> {
		this.logger.log(logWithObject('Update user', { id, ...dto }));

		const user = await this.prisma.user.findFirst({
			where: { id }
		});

		if (!user) {
			throw new NotFoundException(`User with id ${id} was not found`);
		}

		const updatedUser = await this.prisma.user.update({
			where: { id },
			data: { role: dto.role }
		});

		this.logger.log(logWithObject('Updated user', { id: updatedUser.id }));

		return updatedUser;
	}

	public async updateEmail(
		dto: StaffEmailUpdateDto,
		req: Request
	): Promise<void> {
		const sessionPayload = req.session['payload'] as SessionPayloadDto;

		this.logger.log(
			logWithObject('Update user email', {
				email: sessionPayload.email,
				...dto
			})
		);

		const user = await this.prisma.user.findFirst({
			where: { email: sessionPayload.email }
		});

		if (!user) {
			throw new NotFoundException(
				`User with email ${sessionPayload.email} was not found`
			);
		}

		await this.checkExistingEmailOnUpdate(user.id, dto.email);

		this.logger.log(logWithObject('User will be updated', { id: user.id }));

		const updatedUser = await this.prisma.user.update({
			where: { id: user.id },
			data: { email: dto.email }
		});

		this.logger.log(logWithObject('Updated user', { id: updatedUser.id }));

		sessionPayload.email = updatedUser.email;

		this.logger.log(
			logWithObject('Updated session', { email: updatedUser.email })
		);
	}

	public async updatePassword(
		dto: StaffPasswordUpdateDto,
		session: SessionPayloadDto
	): Promise<void> {
		this.logger.log(
			logWithObject('Update user password', {
				email: session.email,
				...dto
			})
		);

		const crypto = new CryptoUtils(
			this.configService.getOrThrow<string>('KAMINARI_PRIVATE_KEY')
		);

		const user = await this.prisma.user.findFirst({
			where: { email: session.email }
		});

		if (crypto.decrypt(user.encryptedPassword) !== dto.oldPassword) {
			this.logger.log('Wrong password');

			throw new MethodNotAllowedException('Wrong password');
		}

		if (dto.newPassword !== dto.confirmPassword) {
			this.logger.log('Password and password confirmation do not match');

			throw new MethodNotAllowedException(
				'Password and password confirmation do not match'
			);
		}

		const updatedUser = await this.prisma.user.update({
			where: { id: user.id },
			data: {
				encryptedPassword: crypto.encrypt(dto.newPassword)
			}
		});

		this.logger.log(logWithObject('Updated user', { id: updatedUser.id }));
	}

	public async remove(id: string): Promise<void> {
		this.logger.log(logWithObject('Delete user', { id }));

		const user = await this.prisma.user.findFirst({
			where: { id }
		});

		if (!user) {
			throw new NotFoundException(`User with id ${id} was not found`);
		}

		await this.prisma.user.delete({ where: { id } });

		this.logger.log(logWithObject('Deleted user', { id }));
	}

	private async checkExistingEmail(dto: StaffCreateDto): Promise<void> {
		const candidate = await this.prisma.user.findMany({
			where: { email: dto.email }
		});

		if (candidate.length > 0) {
			this.logger.log(
				logWithObject('Already existing user', { email: dto.email })
			);

			throw new ConflictException(
				`User with email ${dto.email} is already exists.`
			);
		}
	}

	private async checkExistingEmailOnUpdate(
		userId: string,
		email: string
	): Promise<void> {
		const user = await this.prisma.user.findFirst({ where: { email } });

		if (user) {
			if (user.id !== userId) {
				this.logger.log(
					logWithObject('Already existing user', { email })
				);

				throw new ConflictException(
					`User with email ${email} is already exists.`
				);
			}
		}
	}
}

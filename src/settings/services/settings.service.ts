import {
	Injectable,
	InternalServerErrorException,
	Logger
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as process from 'process';
import { SettingsDto } from '@settings/dto';
import { initSettings } from '@settings/init-settings';
import { logWithObject } from '@toolkit/log-with-object';

/**
 * Settings service
 */
@Injectable()
export class SettingsService {
	private readonly logger = new Logger(SettingsService.name);

	private readonly settingsFileName: string = 'settings';

	/**
	 * Uploaded data from settings file
	 */
	private dto: SettingsDto;

	constructor(private readonly configService: ConfigService) {
		this.getSettingsFromFile()
			.then(dto => {
				this.dto = dto;
			})
			.catch(() => {
				this.create().then();
			});
	}

	/**
	 * Read settings file and get actual settings data
	 * @return Settings data
	 */
	public async getSettingsFromFile(): Promise<SettingsDto> {
		if (await this.checkSettingsExisting()) {
			const fileData = await fs.readFile(this.getSettingsFilePath());

			const deserializedSettings = JSON.parse(fileData.toString());

			return deserializedSettings as SettingsDto;
		}

		throw new InternalServerErrorException('Settings file was not found');
	}

	/**
	 * Get uploaded settings
	 * @return Settings data
	 */
	public getSettings(): SettingsDto {
		return this.dto;
	}

	/**
	 * Get site header from settings
	 * @return Site header
	 */
	public getHeader(): string {
		return this.dto.header;
	}

	/**
	 * Build page title with site name
	 * @param title Clear page title
	 * @return Page title
	 */
	public buildPageTitle(title: string): string {
		return `${title} — ${this.getHeader()}`;
	}

	/**
	 * Get site board links
	 * @return Board links as HTML string
	 */
	public getBoardLinks(): string {
		return this.dto.boardLinks;
	}

	/**
	 * Create and fill settings file by default data
	 */
	public async create(): Promise<void> {
		this.logger.log('Create settings file');

		await this.makeSettingsVolume();

		if (!(await this.checkSettingsExisting())) {
			this.logger.log('Settings file will be created');

			const initialSettings = initSettings();

			await this.setSettingsToFile(initialSettings);

			this.logger.log('Settings file has been created');
		} else {
			this.logger.log('Settings file already exists');
		}
	}

	/**
	 * Update settings file
	 * @param settings Settings DTO with new settings data
	 */
	public async update(settings: SettingsDto): Promise<void> {
		this.logger.log(logWithObject('Update settings file', settings));

		if (await this.checkSettingsExisting()) {
			await this.setSettingsToFile(settings);

			this.logger.log('Settings file was updated');

			this.dto = await this.getSettingsFromFile();
		} else {
			this.logger.error('Settings file was not found');

			throw new InternalServerErrorException(
				'Settings file was not found'
			);
		}
	}

	private async makeSettingsVolume(): Promise<void> {
		const pathToVolume = path.join(
			process.cwd(),
			this.configService.getOrThrow<string>('KAMINARI_VOLUMES_DIR'),
			'kaminari'
		);

		await fs.ensureDir(pathToVolume);
	}

	private async setSettingsToFile(settings: SettingsDto): Promise<void> {
		const filePath = this.getSettingsFilePath();

		await fs.writeFile(filePath, JSON.stringify(settings), {
			flag: 'w'
		});
	}

	private async checkSettingsExisting(): Promise<boolean> {
		return Boolean(await fs.exists(this.getSettingsFilePath()));
	}

	private getSettingsFilePath(): string {
		return path.join(
			process.cwd(),
			this.configService.getOrThrow<string>('KAMINARI_VOLUMES_DIR'),
			'kaminari',
			this.settingsFileName
		);
	}
}

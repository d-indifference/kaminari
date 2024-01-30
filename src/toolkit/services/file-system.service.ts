import { Injectable, Logger } from '@nestjs/common';
import { FileSystemStoredFile } from 'nestjs-form-data';
import * as fsExtra from 'fs-extra';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { logWithObject } from '@toolkit/log-with-object';

/**
 * File system operations service
 */
@Injectable()
export class FileSystemService {
	private readonly logger = new Logger(FileSystemService.name);

	constructor() {}

	/**
	 * Calculate directory size
	 * @param dirPath Path to directory
	 * @return Directory size in bytes
	 */
	public async dirSize(dirPath: string): Promise<number> {
		if (fsSync.existsSync(dirPath)) {
			const stat = await fs.stat(dirPath);

			if (stat.isDirectory()) {
				let totalSize = 0;

				const dirSizeRecursive = async (
					dirPath: string
				): Promise<void> => {
					const stat = await fs.stat(dirPath);

					if (stat.isDirectory()) {
						const files = await fs.readdir(dirPath);

						for (const file of files) {
							await dirSizeRecursive(path.join(dirPath, file));
						}
					} else {
						totalSize += stat.size;
					}
				};

				await dirSizeRecursive(dirPath);

				return totalSize;
			}
		}

		return 0;
	}

	/**
	 * Save file from form uploader
	 * @param fullStoragePath Full storage path
	 * @param file File from FormData
	 * @param name New file name (without extension)
	 * @return New file full path
	 */
	public async saveFileFromForm(
		fullStoragePath: string,
		file: FileSystemStoredFile,
		name?: string
	): Promise<string> {
		if (!file) {
			return null;
		}

		this.logger.log(
			logWithObject('Save file from form to permanent storage', {
				file,
				storage: fullStoragePath
			})
		);

		let newFilePath: string;

		await fsExtra.ensureDir(fullStoragePath);

		if (name) {
			const extname = path.extname(file.path);

			newFilePath = path.join(fullStoragePath, `${name}${extname}`);

			await fsExtra.move(file.path, newFilePath, {
				overwrite: false
			});
		} else {
			newFilePath = path.join(fullStoragePath, path.basename(file.path));

			await fsExtra.move(file.path, newFilePath);
		}

		this.logger.log(logWithObject('File saved', { path: newFilePath }));

		return newFilePath;
	}

	/**
	 * Remove path (directory or file)
	 * @param filePath Full file or directory path
	 */
	public async removePath(filePath: string): Promise<void> {
		this.logger.log(logWithObject('Remove path', { path: filePath }));

		if (!(await fsExtra.pathExists(filePath))) {
			this.logger.log(
				logWithObject('Path does not exist', { path: filePath })
			);
		} else {
			const stat = await fs.stat(filePath);

			if (stat.isFile()) {
				await fs.unlink(filePath);
			}

			if (stat.isDirectory()) {
				await fsExtra.emptyDir(filePath);
				await fs.rmdir(filePath);
			}

			this.logger.log(
				logWithObject('Path has been deleted', { path: filePath })
			);
		}
	}

	/**
	 * Remove paths (directory or file)
	 * @param filePaths Full file or directory paths
	 */
	public async removePaths(filePaths: string[]): Promise<void> {
		for (const filePath of filePaths) {
			await this.removePath(filePath);
		}
	}

	/**
	 * Remove directory if it is empty
	 * @param dirPath Full directory path
	 */
	public async rmdirIfEmpty(dirPath: string): Promise<void> {
		if ((await fs.readdir(dirPath)).length === 0) {
			this.logger.log(
				logWithObject(
					'Directory will be removed, because it is empty',
					{
						dirPath
					}
				)
			);

			await this.removePath(dirPath);

			this.logger.log(
				logWithObject('Directory has been removed', {
					dirPath
				})
			);
		} else {
			this.logger.log('Directory is not empty, it will not be removed');
		}
	}
}

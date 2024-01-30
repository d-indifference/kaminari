import { Injectable } from '@nestjs/common';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { PackageJsonDto } from '@admin/dto/dependenices';
import * as process from 'process';

/**
 * Service for `package.json` interaction
 */
@Injectable()
export class AdminDependenciesService {
	constructor() {}

	/**
	 * Get dependencies records
	 * @return Dependencies from `package.json`
	 */
	public async getDependencies(): Promise<
		Pick<PackageJsonDto, 'dependencies' | 'devDependencies'>
	> {
		const packageJson = await this.readPackageJson();

		return {
			dependencies: packageJson.dependencies,
			devDependencies: packageJson.devDependencies
		};
	}

	private async readPackageJson(): Promise<PackageJsonDto> {
		const pathToPackageJson = path.join(process.cwd(), 'package.json');

		const packageData = await fsExtra.readFile(pathToPackageJson);

		const packageObject = JSON.parse(packageData.toString());

		return packageObject as PackageJsonDto;
	}
}

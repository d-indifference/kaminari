/**
 * `package.json` Object type
 */
export class PackageJsonDto {
	/**
	 * The name of the package.
	 */
	name: string;

	/**
	 * Version must be parseable by node-semver, which is bundled with npm as a dependency.
	 */
	version: string;

	/**
	 * This helps people discover your package, as it's listed in 'npm search'.
	 */
	description: string;

	/**
	 * A person who has been involved in creating or maintaining this package.
	 */
	author: string;

	/**
	 * If set to true, then npm will refuse to publish it.
	 */
	private: boolean;

	/**
	 * Package license.
	 */
	license: string;

	/**
	 * Script commands that are run at various times in the lifecycle of your package
	 */
	scripts: Record<string, string>;

	/**
	 * Dependencies are specified with a simple hash of package name to version range
	 */
	dependencies: Record<string, string>;

	/**
	 * Development dependencies.
	 */
	devDependencies: Record<string, string>;
}

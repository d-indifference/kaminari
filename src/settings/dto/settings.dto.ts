import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Global site settings DTO
 */
export class SettingsDto {
	/**
	 * Main site header
	 */
	@IsString()
	@IsNotEmpty()
	header: string;

	/**
	 * Site slogan
	 */
	@IsString()
	slogan: string;

	/**
	 * Site description
	 */
	@IsString()
	description: string;

	/**
	 * Links in page header and footer
	 */
	@IsString()
	boardLinks: string;

	/**
	 * Left menu frame header
	 */
	@IsString()
	@IsNotEmpty()
	leftMenuHeader: string;

	/**
	 * Left menu frame content
	 */
	@IsString()
	@IsNotEmpty()
	leftMenuContent: string;

	/**
	 * FAQ page content
	 */
	@IsString()
	faqHtml: string;

	/**
	 * Rules page content
	 */
	@IsString()
	rulesHtml: string;
}

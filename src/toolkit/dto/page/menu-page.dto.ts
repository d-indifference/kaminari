import { BasePageDto } from '@toolkit/dto/page/base-page.dto';

/**
 * Menu page DTO
 */
export class MenuPageDto extends BasePageDto {
	/**
	 * Left menu header
	 */
	leftMenuHeader: string;

	/**
	 * Left menu content
	 */
	leftMenuContent: string;
}

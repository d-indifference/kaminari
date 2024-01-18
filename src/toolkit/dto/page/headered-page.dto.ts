import { BasePageDto } from '@toolkit/dto/page/base-page.dto';
/**
 * Base for page template with dynamic header
 */
export class HeaderedPageDto extends BasePageDto {
	/**
	 * Page header
	 */
	header: string;
}

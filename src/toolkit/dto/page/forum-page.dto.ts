import { HeaderedPageDto } from '@toolkit/dto/page/headered-page.dto';

/**
 * Base DTO for forum page
 */
export class ForumPageDto extends HeaderedPageDto {
	/**
	 * Board links as HTML string
	 */
	boardLinks: string;
}

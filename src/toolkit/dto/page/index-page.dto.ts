import { ForumPageDto } from '@toolkit/dto/page/forum-page.dto';

/**
 * Index page DTO
 */
export class IndexPageDto extends ForumPageDto {
	/**
	 * Site slogan
	 */
	slogan: string;

	/**
	 * Site description
	 */
	description: string;
}

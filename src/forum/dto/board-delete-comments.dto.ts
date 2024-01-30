import { HtmlCheckboxBoolean, htmlCheckboxBooleanRegexp } from '@toolkit/types';
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Matches
} from 'class-validator';

/**
 * DTO for delete comments form by user
 */
export class BoardDeleteCommentsDto {
	/**
	 * Number of comments which must be deleted
	 */
	delete: string[] | string;

	/**
	 * Delete whole comment or only file
	 */
	@IsOptional()
	@Matches(htmlCheckboxBooleanRegexp)
	fileOnly: HtmlCheckboxBoolean;

	/**
	 * Deletion password
	 */
	@IsString()
	@IsNotEmpty()
	@Length(8)
	password: string;
}

import {
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Render
} from '@nestjs/common';
import { ForumPageBuilder } from '@toolkit/page-builder';
import { SettingsService } from '@settings/services';
import { ForumService } from '@forum/services';
import { BoardPageDto, ThreadPageDto } from '@forum/dto';
import { PageNumberPipe } from '@toolkit/pipes';

/**
 * Forum controller
 */
@Controller()
export class ForumController {
	constructor(
		private readonly settingsService: SettingsService,
		private readonly forumService: ForumService
	) {}

	/**
	 * Get threads on first page
	 */
	@Get(':url')
	@Render('board')
	public async boardFirstPage(
		@Param('url') url: string
	): Promise<BoardPageDto> {
		const data = await this.forumService.findAllThreads(url, 0);

		return new ForumPageBuilder(data)
			.setBoardLinks(this.settingsService.getBoardLinks())
			.setHeader(this.settingsService.buildPageTitle(data.name))
			.setTitle(this.settingsService.buildPageTitle(data.name))
			.build();
	}

	/**
	 * Get full thread with replies
	 */
	@Get(':url/res/:numberOnBoard')
	@Render('thread')
	public async thread(
		@Param('url') url: string,
		@Param('numberOnBoard', ParseIntPipe) numberOnBoard: number
	): Promise<ThreadPageDto> {
		const data = await this.forumService.getThread(url, numberOnBoard);

		return new ForumPageBuilder(data)
			.setBoardLinks(this.settingsService.getBoardLinks())
			.setHeader(this.settingsService.buildPageTitle(data.name))
			.setTitle(this.settingsService.buildPageTitle(data.name))
			.build();
	}

	/**
	 * Get threads on second and other pages
	 */
	@Get(':url/:page')
	@Render('board')
	public async boardPage(
		@Param('url') url: string,
		@Param('page', new PageNumberPipe()) page: number
	): Promise<BoardPageDto> {
		const data = await this.forumService.findAllThreads(url, page);

		if (page > 0 && data.threads.length === 0) {
			throw new NotFoundException(`Cannot GET /${url}/${page}`);
		}

		return new ForumPageBuilder(data)
			.setBoardLinks(this.settingsService.getBoardLinks())
			.setHeader(this.settingsService.buildPageTitle(data.name))
			.setTitle(this.settingsService.buildPageTitle(data.name))
			.build();
	}
}

import { Controller, Get, Render } from '@nestjs/common';
import { BasePageDto, ForumPageDto, MenuPageDto } from '@toolkit/dto/page';
import { BasePageBuilder, ForumPageBuilder } from '@toolkit/page-builder';
import { SettingsService } from '@settings/services';
import { IndexPageDto } from '@toolkit/dto/page/index-page.dto';

/**
 * Main Application Controller
 */
@Controller()
export class AppController {
	constructor(private readonly settingsService: SettingsService) {}

	/**
	 * Index page
	 */
	@Get()
	@Render('index')
	public index(): BasePageDto {
		return new BasePageBuilder(new BasePageDto())
			.setTitle(this.settingsService.getHeader())
			.build();
	}

	/**
	 * Menu frame page
	 */
	@Get('menu')
	@Render('menu')
	public menu(): MenuPageDto {
		const page = new MenuPageDto();
		page.leftMenuHeader = this.settingsService.getSettings().leftMenuHeader;
		page.leftMenuContent =
			this.settingsService.getSettings().leftMenuContent;

		return new BasePageBuilder(page)
			.setTitle(this.settingsService.buildPageTitle('Menu'))
			.build();
	}

	/**
	 * Main frame page
	 */
	@Get('main')
	@Render('main')
	public main(): ForumPageDto {
		const data = new IndexPageDto();
		data.slogan = this.settingsService.getSettings().slogan;
		data.description = this.settingsService.getSettings().description;

		return new ForumPageBuilder(data)
			.setBoardLinks(this.settingsService.getBoardLinks())
			.setHeader(this.settingsService.getHeader())
			.setTitle(this.settingsService.buildPageTitle('Home'))
			.build();
	}
}

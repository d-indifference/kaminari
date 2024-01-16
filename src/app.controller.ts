import { Controller, Get, Render } from '@nestjs/common';
import { BasePageDto, HeaderedPageDto } from '@toolkit/dto/page';
import { BasePageBuilder, HeaderedPageBuilder } from '@toolkit/page-builder';

/**
 * Main Application Controller
 */
@Controller()
export class AppController {
	/**
	 * Index page
	 */
	@Get()
	@Render('index')
	public index(): unknown {
		return {};
	}

	/**
	 * Menu frame page
	 */
	@Get('menu')
	@Render('menu')
	public menu(): BasePageDto {
		return new BasePageBuilder(new BasePageDto())
			.setTitle('Menu — Kaminari Image Board')
			.build();
	}

	/**
	 * mMain frame page
	 */
	@Get('main')
	@Render('main')
	public main(): HeaderedPageDto {
		return new HeaderedPageBuilder(new HeaderedPageDto())
			.setHeader('Kaminari Image Board')
			.setTitle('Home — Kaminari Image Board')
			.build();
	}
}

import { SettingsDto } from '@settings/dto';

/**
 * Create settings DTO with default settings
 * @return Settings DTO
 */
export const initSettings = (): SettingsDto => {
	const dto = new SettingsDto();

	dto.header = 'Kaminari Image Board';
	dto.slogan = 'You can set your own slogan here!';
	dto.description = '<p>Set your own site description.</p>';
	dto.boardLinks = `[<a href="/admin">Management</a>] ||
    [<a href="/faq">FAQ</a>]
    [<a href="/rules">Rules</a>] ||
    [<a href="/main">Home</a>]`;
	dto.faqHtml = '<p>Set your own FAQ</p>';
	dto.rulesHtml = `
	<p>Global site rules:</p>
	<ol>
		<li>No CP</li>
		<li>No shitposting</li>
		<li>Moderator is always right</li>
	</ol>
	`;
	dto.leftMenuHeader = 'Kaminari IB';
	dto.leftMenuContent = `
	<hr>
	<div class="menu-header">About site</div>
	<p><a href="/faq">FAQ</a></p>
	<p><a href="/rules">Rules</a></p>
	`;

	return dto;
};

import { BasePageDto } from '@toolkit/dto/page/base-page.dto';
import { SessionPayloadDto } from '@admin/dto/session';

export class HeaderedSessionPageDto extends BasePageDto {
	header: string;

	session: SessionPayloadDto;
}

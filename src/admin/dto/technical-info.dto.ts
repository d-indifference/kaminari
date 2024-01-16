import * as os from 'os';
import { SessionPayloadDto } from '@admin/dto/session';
import { HeaderedSessionPageDto } from '@toolkit/dto/page';

export class TechnicalInfoDto extends HeaderedSessionPageDto {
	currentSession: SessionPayloadDto;

	diskSpaceUsed: string;

	totalPosts: number;

	totalBoards: number;

	uptime: number;

	cpus: os.CpuInfo[];

	memory: {
		total: string;
		inUsage: string;
		free: string;
	};

	port: number;

	debugPort: number;

	host: string;

	processVersions: Record<string, string>;
}

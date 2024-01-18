import * as os from 'os';
import { SessionPayloadDto } from '@admin/dto/session';
import { HeaderedSessionPageDto } from '@toolkit/dto/page';

/**
 * Technical information DTO
 */
export class TechnicalInfoDto extends HeaderedSessionPageDto {
	/**
	 * Current session payload
	 */
	currentSession: SessionPayloadDto;

	/**
	 * Total disk space usage
	 */
	diskSpaceUsed: string;

	/**
	 * Total posts count
	 */
	totalPosts: number;

	/**
	 * Total boards count
	 */
	totalBoards: number;

	/**
	 * Process uptime
	 */
	uptime: number;

	/**
	 * Info about CPUs
	 */
	cpus: os.CpuInfo[];

	/**
	 * Info about memory
	 */
	memory: {
		total: string;
		inUsage: string;
		free: string;
	};

	/**
	 * Main port number
	 */
	port: number;

	/**
	 * Debug port number
	 */
	debugPort: number;

	/**
	 * Application host
	 */
	host: string;

	/**
	 * Node.js process versions
	 */
	processVersions: Record<string, string>;

	/**
	 * Postgres version
	 */
	postgresVersion: string;
}

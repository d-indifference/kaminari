import { Board } from '@prisma/client';

/**
 * Board DTO for display in admin panel
 */
export class BoardDto {
	/**
	 * ID
	 */
	id: string;

	/**
	 * URL
	 */
	url: string;

	/**
	 * Name
	 */
	name: string;

	/**
	 * Total posts count
	 */
	totalPosts: number;

	/**
	 * Total files count
	 */
	totalFiles: number;

	/**
	 * Disk space usage by board
	 */
	diskSpaceUsage: string;

	/**
	 * Board DTO for display in admin panel
	 * @param board Board entity
	 * @param totalPosts Total posts count
	 * @param totalFiles Total files count
	 * @param diskSpaceUsage Disk space usage by board
	 */
	constructor(
		board: Board,
		totalPosts: number,
		totalFiles: number,
		diskSpaceUsage: string
	) {
		this.id = board.id;
		this.url = board.url;
		this.name = board.name;
		this.totalPosts = totalPosts;
		this.totalFiles = totalFiles;
		this.diskSpaceUsage = diskSpaceUsage;
	}
}

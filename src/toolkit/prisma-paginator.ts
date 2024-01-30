import { PrismaService } from '@toolkit/services';

/**
 * Page of Prisma models
 */
export class PrismaPage<T> {
	/**
	 * Models
	 */
	public objects: T[];

	/**
	 * Total models count
	 */
	public totalCount: number;

	/**
	 * Previous page number. Should be `null`, if page does not exist
	 */
	public previousPageNumber: number;

	/**
	 * Next page number. Should be `null`, if page does not exist
	 */
	public nextPageNumber: number;
}

/**
 * Prisma page paginator
 */
export class PrismaPaginator {
	private prisma: PrismaService;

	private model: string;

	/**
	 * Prisma page paginator
	 * @param prisma Prisma service
	 * @param model Prisma model name
	 */
	constructor(prisma: PrismaService, model: string) {
		this.prisma = prisma;
		this.model = model;
	}

	/**
	 * Get page of records
	 * @param number Page number
	 * @param size Page size
	 * @param orderBy `ORDER BY` expression
	 */
	public async pageRequest<T>(
		number = 0,
		size = 10,
		orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' }
	): Promise<PrismaPage<T>> {
		const models = (await this.prisma[this.model].findMany({
			skip: number * size,
			take: size,
			orderBy
		})) as T[];

		const totalCount = await this.prisma[this.model].count();

		let previousPageNumber: number;
		let nextPageNumber: number;

		if (number > 0) {
			previousPageNumber = number - 1;
		}

		const mod = totalCount % size;

		let pageCount = Math.floor(totalCount / size);

		if (mod > 0) {
			pageCount += 1;
		}

		if (number + 1 < pageCount) {
			nextPageNumber = number + 1;
		}

		const page = new PrismaPage<T>();
		page.objects = models;
		page.totalCount = totalCount;
		page.previousPageNumber = previousPageNumber;
		page.nextPageNumber = nextPageNumber;

		return page;
	}
}

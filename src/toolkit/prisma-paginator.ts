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
	 */
	public async pageRequest<T>(number = 0, size = 10): Promise<PrismaPage<T>> {
		const normalizedPageNumber = Number(this.normalizeInteger(number));
		const normalizedPageSize = Number(this.normalizeInteger(size));

		const models = (await this.prisma[this.model].findMany({
			skip: normalizedPageNumber * normalizedPageSize,
			take: normalizedPageSize,
			orderBy: { createdAt: 'desc' }
		})) as T[];

		const totalCount = await this.prisma[this.model].count();

		let previousPageNumber: number;
		let nextPageNumber: number;

		if (normalizedPageNumber > 0) {
			previousPageNumber = normalizedPageNumber - 1;
		}

		const mod = totalCount % normalizedPageSize;

		let pageCount = Math.floor(totalCount / normalizedPageSize);

		if (mod > 0) {
			pageCount += 1;
		}

		if (normalizedPageNumber + 1 < pageCount) {
			nextPageNumber = normalizedPageNumber + 1;
		}

		const page = new PrismaPage<T>();
		page.objects = models;
		page.totalCount = totalCount;
		page.previousPageNumber = previousPageNumber;
		page.nextPageNumber = nextPageNumber;

		return page;
	}

	private normalizeInteger(num: number): number {
		if (isNaN(num)) {
			return 0;
		}

		if (num >= 0) {
			if (Boolean(num % 1)) {
				return Math.round(num);
			}
			return num;
		}

		return 0;
	}
}

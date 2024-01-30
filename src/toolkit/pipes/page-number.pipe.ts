import {
	ArgumentMetadata,
	BadRequestException,
	ParseIntPipe,
	PipeTransform
} from '@nestjs/common';

export class PageNumberPipe implements PipeTransform {
	async transform(
		value: string,
		metadata: ArgumentMetadata
	): Promise<number> {
		if (value === '' || value === null || value === undefined) {
			return 0;
		}

		const parseIntPipe = new ParseIntPipe();

		const intValue = await parseIntPipe.transform(value, metadata);

		if (intValue < 0) {
			throw new BadRequestException(
				'Page number cannot be a negative number!'
			);
		}

		return intValue;
	}
}

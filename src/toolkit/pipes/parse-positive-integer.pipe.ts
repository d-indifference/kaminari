import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	ParseIntPipe,
	PipeTransform
} from '@nestjs/common';

@Injectable()
export class ParsePositiveIntegerPipe implements PipeTransform {
	async transform(
		value: string | number,
		metadata: ArgumentMetadata
	): Promise<number> {
		let parsedInt: number;

		if (typeof value === 'number') {
			parsedInt = value;
		} else {
			const parseIntPipe = new ParseIntPipe();

			parsedInt = await parseIntPipe.transform(value, metadata);
		}

		if (parsedInt < 0) {
			throw new BadRequestException(`Number ${value} is not positive`);
		}

		return parsedInt;
	}
}

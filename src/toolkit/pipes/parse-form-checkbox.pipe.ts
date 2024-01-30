import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform
} from '@nestjs/common';

@Injectable()
export class ParseFormCheckboxPipe implements PipeTransform {
	transform(value: 'on' | undefined, metadata: ArgumentMetadata): boolean {
		if (value === 'on') {
			return true;
		}

		if (value === undefined) {
			return false;
		}

		throw new BadRequestException('Not correct form checkbox value');
	}
}

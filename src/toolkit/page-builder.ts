import {
	BasePageDto,
	BaseSessionPageDto,
	HeaderedPageDto,
	HeaderedSessionPageDto
} from '@toolkit/dto/page';
import { SessionPayloadDto } from '@admin/dto/session';

export class BasePageBuilder<T extends BasePageDto> {
	protected readonly obj: T;

	constructor(obj: T) {
		this.obj = obj;
	}

	public setTitle(title: string): BasePageBuilder<T> {
		this.obj.title = title;

		return this;
	}

	public build(): T {
		return this.obj;
	}
}

export class HeaderedPageBuilder<
	T extends HeaderedPageDto
> extends BasePageBuilder<T> {
	constructor(obj: T) {
		super(obj);
	}

	public setHeader(header: string): HeaderedPageBuilder<T> {
		this.obj.header = header;

		return this;
	}
}

export class SessionPageBuilder<
	T extends BaseSessionPageDto
> extends BasePageBuilder<T> {
	constructor(obj: T) {
		super(obj);
	}

	public setSession(session: SessionPayloadDto): SessionPageBuilder<T> {
		this.obj.session = session;

		return this;
	}
}

export class HeaderedSessionPageBuilder<
	T extends HeaderedSessionPageDto
> extends BasePageBuilder<T> {
	constructor(obj: T) {
		super(obj);
	}

	public setSession(
		session: SessionPayloadDto
	): HeaderedSessionPageBuilder<T> {
		this.obj.session = session;

		return this;
	}

	public setHeader(header: string): HeaderedPageBuilder<T> {
		this.obj.header = header;

		return this;
	}
}

export const logWithObject = (
	message: string,
	obj: unknown,
	delimiter = ': '
): string => `${message}${delimiter}${JSON.stringify(obj)}`;

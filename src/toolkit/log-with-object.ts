/**
 * Create message with stringified object
 * @param message Main message
 * @param obj Object (such as DTO) for logging
 * @param delimiter Divides main message and stringified object
 */
export const logWithObject = (
	message: string,
	obj: unknown,
	delimiter = ': '
): string => `${message}${delimiter}${JSON.stringify(obj)}`;

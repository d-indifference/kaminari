import * as CryptoJS from 'crypto-js';

/**
 * Encrypt or decrypt a string with defined key
 */
export class CryptoUtils {
	/**
	 * Secret key
	 */
	private readonly key: string;

	constructor(key: string) {
		this.key = key;
	}

	/**
	 * Encrypt the string
	 * @param str source string
	 */
	public encrypt(str: string): string {
		return CryptoJS.AES.encrypt(str, this.key).toString();
	}

	/**
	 * Decrypt the string
	 * @param str Encrypted string
	 */
	public decrypt(str: string): string {
		const bytes = CryptoJS.AES.decrypt(str, this.key);

		return bytes.toString(CryptoJS.enc.Utf8);
	}
}
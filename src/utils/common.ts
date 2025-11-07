import CryptoJS from "crypto-js";
import { AppSettings } from "./config";
import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { AuthenticatedRequest } from "../middlewares/authorize";
import { UnauthorizedError } from "../models/errors/unauthorizedError";
import { ITokenPayload } from "../models/tokenPayload";

export const CommonUtils = {
	profilePictureFolder: 'uploads/profile-pictures',
	documentsFolder: 'uploads/documents',
	hashPassword: async (plainPassword: string): Promise<string> => {
		return await bcrypt.hash(plainPassword, 10);
	},

	verifyPassword: async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
		return await bcrypt.compare(plainPassword, hashedPassword);
	},

	checkIsNullUndefinedOrEmptySpace: (value: any) => value === null || value === undefined || (typeof value === 'string' && value.trim() === ''),

	checkIfArrayIsEmpty: (array: any) => array === null || array === undefined || (Array.isArray(array) && array.length === 0),

	encrypt: (value: string): string => {
		const ciphertext = CryptoJS.AES.encrypt(value, AppSettings.cryptSecret).toString();
		const urlSafe = ciphertext.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
		return urlSafe;
	},

	decrypt: (encryptedValue: string): string => {
		try {
			let base64 = encryptedValue.replace(/-/g, '+').replace(/_/g, '/');
			const pad = base64.length % 4;
			if (pad) base64 += '='.repeat(4 - pad);

			const bytes = CryptoJS.AES.decrypt(base64, AppSettings.cryptSecret);
			const originalText = bytes.toString(CryptoJS.enc.Utf8);

			if (!originalText)
				throw new Error('Decryption failed. Invalid key or corrupted data.');

			return originalText;
		} catch (error) {
			console.error("Decryption Error:", error);
			return "";
		}
	},

	generateRandomString: (length: number = 12): string => {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let result = '';

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * charactersLength);
			result += characters.charAt(randomIndex);
		}

		return result;
	},

	generateUUID: (): string => {
		const bytes = randomBytes(16);

		// Per RFC 4122 standard
		bytes[6] = (bytes[6] & 0x0f) | 0x40; // UUID version 4
		bytes[8] = (bytes[8] & 0x3f) | 0x80; // UUID variant

		const byteToHex = Array.from(bytes, b => b.toString(16).padStart(2, '0'));

		return [
			byteToHex.slice(0, 4).join(''),
			byteToHex.slice(4, 6).join(''),
			byteToHex.slice(6, 8).join(''),
			byteToHex.slice(8, 10).join(''),
			byteToHex.slice(10, 16).join(''),
		].join('-');
	},

	renderEmailTemplate: (templatePath: string, replacements: Record<string, string>): string => {
		let html = fs.readFileSync(path.resolve(templatePath), 'utf-8');

		for (const key in replacements) {
			html = html.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
		}

		return html;
	},

	getTempFolder: (): string => {
		const tmpDir = path.join(os.tmpdir(), 'temp');
		fs.mkdirSync(tmpDir, { recursive: true });

		return tmpDir;
	},

	getTokenPayload: (req: unknown): ITokenPayload => {
		const user = (req as AuthenticatedRequest)?.user;
		if (!user) throw new UnauthorizedError();
		return user;
	},

	generateStrongPassword: (length: number = 8): string => {
		if (length < 8)
			throw new Error("Password length must be at least 4 to include all character types.");

		const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const lower = 'abcdefghijklmnopqrstuvwxyz';
		const digits = '0123456789';
		const special = '@$%#!?&';
		const all = upper + lower + digits + special;

		const getRandomChar = (set: string) => set[Math.floor(Math.random() * set.length)];

		// Ensure one of each required character type
		const passwordChars = [
			getRandomChar(upper),
			getRandomChar(lower),
			getRandomChar(digits),
			getRandomChar(special),
		];

		// Fill the rest
		for (let i = passwordChars.length; i < length; i++) {
			passwordChars.push(getRandomChar(all));
		}

		// Shuffle the password to avoid predictable positions
		for (let i = passwordChars.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
		}

		return passwordChars.join('');
	},

	regex: {
		vatRegex: /^[A-Z]{2}[0-9A-Z]{8,12}$/,
		emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
		numericRegex: /^[0-9]+$/,
		alphaNumericRegex: /^[a-zA-Z0-9]+$/,
		numberWithUpToNDecimalsRegex: (n: number = 2) => new RegExp(`^\\d+(\\.\\d{1,${n}})?$`),
		testRegex: (regex: RegExp, value: string): boolean => new RegExp(regex).test(value),
	},

	extractBaseURL: (urlStr: string): string => {
		try {
			const url = new URL(urlStr);
			return `${url.protocol}//${url.host}`;
		}
		catch (e) {
			return '';
		}
	},

	delay: (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms)),

	prettyFileSize: (bytes: number, decimals = 2): string => {
		if (bytes === 0) return '0 B';

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];

		const i = Math.floor(Math.log(bytes) / Math.log(k));
		const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

		return `${size} ${sizes[i]}`;
	},

	getBasePath: () => path.resolve(__dirname, "../.."),
};

import { CommonUtils } from '../../utils/common';
import { BaseHttpError } from './baseHttpError';

export class BadRequestError extends BaseHttpError {
    constructor(message: string, data?: any) {
        super(message, 400, data);
    }

    static throwIfNullUndefinedOrEmptySpace(arg: any | null | undefined, message: string, data?: any) {
        if (typeof arg === 'undefined' || typeof arg === null || (typeof arg === "string" && arg.trim().length === 0))
            throw new BadRequestError(message, data);
    }

    static throwIfArrayIsEmpty(arg: any | null | undefined, message: string, data?: any) {
        if (typeof arg === 'undefined' || typeof arg === null || (Array.isArray(arg) && arg.length === 0))
            throw new BadRequestError(message, data);
    }

    static throwIfNullOrUndefined(arg: any | null | undefined, message: string, data?: any) {
        if (typeof arg === 'undefined' || typeof arg === null)
            throw new BadRequestError(message, data);
    }

    static throwIfRegexMismatch(arg: string, pattern: RegExp, message: string, data?: any) {
        if (!CommonUtils.regex.testRegex(pattern, arg))
            throw new BadRequestError(message, data);
    }
}

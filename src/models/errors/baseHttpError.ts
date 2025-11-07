export class BaseHttpError extends Error {
    public statusCode: number;
    public data?: any;

    constructor(message: string, statusCode: number = 500, data?: any) {
        super(message);
        this.name = new.target.name; // Auto-name from subclass
        this.statusCode = statusCode;
        this.data = data;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}


export class AppError extends Error {}

export class WrappedError extends Error {
    error: any;

    constructor(message: string, error: any) {
        super(message);

        this.error = error;
    }
}

export class RequestError extends Error {
    status: number;
    statusText?: string;

    constructor(message: string, status: number, statusText?: string) {
        super(message);

        this.status = status;
        this.statusText = statusText;
    }
}
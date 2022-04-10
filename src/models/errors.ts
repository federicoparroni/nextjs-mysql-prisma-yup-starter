export enum ErrorCode {
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    BAD_REQUEST = "BAD_REQUEST",
    FORBIDDEN = "FORBIDDEN",
}
export default ErrorCode;

export class ApiError {
    error?: ErrorCode
    statusCode: number

    constructor(error?: ErrorCode, statusCode: number = 400) {
        this.error = error;
        this.statusCode = statusCode;
    }
}

export class InternalServerError extends ApiError {
    statusCode: number = 500
}
export class BadRequest extends ApiError {
    statusCode: number = 400
}
export class NotFound extends ApiError {
    statusCode: number = 404
}
export class PreconditionFailed extends ApiError {
    statusCode: number = 412
}

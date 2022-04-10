import * as Yup from 'yup';
import ErrorCode from "./errors"

export type APIResponseError = {
    error: ErrorCode
}
export type APIResponseSuccess<T> = T
export type APIResponse<T> = APIResponseSuccess<T> | APIResponseError

// pagination
export type APIResponsePaginatedSuccess<T> = {
    total: number,
    offset?: number,
    limit?: number,
    items: T[]
}
export type APIPaginatedResponse<T> = APIResponsePaginatedSuccess<T> | APIResponseError

export const PaginatedRequestSchema = Yup.object().shape({
    limit: Yup.number().integer(ErrorCode.BAD_REQUEST).min(0).optional().default(20),
    offset: Yup.number().integer(ErrorCode.BAD_REQUEST).min(0).optional().default(0),
});
export type PaginatedRequest = Yup.InferType<typeof PaginatedRequestSchema>;

import { ValidationError } from "yup";
import { ApiError } from "../models/errors";

export default function errorMiddleware(err, req, res, next) {
    if(err instanceof ValidationError) {
        return res.status(412).json({
            error: err.message,
            _debug: err,
        });
    } else if(err instanceof ApiError) {
        const error = err as ApiError;
        return res.status(error.statusCode).json({
            error: error.error
        })
    } else {
        console.error(err);
        res.status(500).end();
    }
}

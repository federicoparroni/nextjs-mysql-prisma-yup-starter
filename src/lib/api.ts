import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import errorMiddleware from "../middlewares/error";

export default function apiHandler() {
    return nc<NextApiRequest, NextApiResponse>({
        onError: errorMiddleware,
        onNoMatch: (req, res, next) => {
            res.status(404).end();
        },
    });
}

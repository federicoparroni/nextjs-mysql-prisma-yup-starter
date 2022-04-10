import { NextApiRequest } from "next";
import apiHandler from "../../../lib/api";
import { PaginatedRequestSchema } from "../../../models/api";
import { APIResponse, APIPaginatedResponse } from "../../../models/api";
import prisma from "../../../lib/prisma";
import { PrismaClient } from "@prisma/client";
import { PreconditionFailed } from "../../../models/errors";
import { User, UserCreateSchema, UserSchema } from "../../../models/user";

const handler = apiHandler()
.post<NextApiRequest, APIResponse<User>>(async (req, res) => {
    const data = await UserCreateSchema.validate(req.body, {stripUnknown: true});;
    
    const user = await prisma.$transaction(async (prismaInstance: PrismaClient) => {
        const duplicate = await prisma.user.findFirst({
            where: { email: data.email }
        });
        if(duplicate) throw new PreconditionFailed();

        return await prisma.user.create({ data });
    });

    return res.status(201).json(UserSchema.cast(user, {stripUnknown: true}));
})
.get<NextApiRequest, APIPaginatedResponse<User>>(async (req, res) => {
    const { limit, offset } = await PaginatedRequestSchema.validate(req.query, {stripUnknown: true});

    const items = (await prisma.user.findMany({
        take: limit,
        skip: offset,
    })).map(user => UserSchema.cast(user, {stripUnknown: true}));
    const total = await prisma.user.count({});

    return res.status(200).json({ total, offset, limit, items });
});

export default handler;

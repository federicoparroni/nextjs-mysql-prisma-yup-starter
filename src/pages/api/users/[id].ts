import apiHandler from "../../../lib/api";
import { NextApiRequest } from "next";
import { APIResponse } from "../../../models/api";
import prisma from "../../../lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NotFound } from "../../../models/errors";
import { getUser } from "../../../repo/user";
import { User, UserGetSchema, UserPatchSchema, UserSchema } from "../../../models/user";

const handler = apiHandler()
.get<NextApiRequest, APIResponse<User>>(async (req, res) => {
    const { id } = await UserGetSchema.validate(req.query, {stripUnknown: true});
    const item = await getUser(id, prisma);
    if (!item) throw new NotFound();

    return res.status(200).json(item);
})
.patch<NextApiRequest, APIResponse<User>>(async (req, res) => {
    const { id } = await UserGetSchema.validate(req.query, {stripUnknown: true});
    const userPatch = await UserPatchSchema.validate(req.body, {stripUnknown: true});

    const patched = await prisma.$transaction(async (prisma: PrismaClient) => {
        const found = await getUser(id, prisma);
        if (!found) throw new NotFound();

        return await prisma.user.update({
            where: { id: found.id },
            data: userPatch
        });
    });

    return res.status(200).json(UserSchema.cast(patched, {stripUnknown: true}));
})
.delete<NextApiRequest, APIResponse<User>>(async (req, res) => {
    const { id } = await UserGetSchema.validate(req.query, {stripUnknown: true});

    const deleted = await prisma.$transaction(async (prisma: PrismaClient) => {
        const found = await getUser(id, prisma);
        if (!found) throw new NotFound();

        await prisma.user.delete({ where: { id: found.id }, select: { id: true } });
        return found;
    });

    return res.status(200).json(UserSchema.cast(deleted, {stripUnknown: true}));
});

export default handler;

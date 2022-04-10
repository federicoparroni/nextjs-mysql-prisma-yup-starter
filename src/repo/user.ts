import { PrismaClient } from "@prisma/client";
import { User, UserSchema } from "../models/user";

export async function getUser(id: number, prisma: PrismaClient): Promise<User | null> {
    const item = await prisma.user.findUnique({
        where: { id },
    });
    if (!item) return null;

    return UserSchema.cast(item, { stripUnknown: true });
}

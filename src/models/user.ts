import * as Yup from 'yup';
import { enumToArray } from '../utils/types';
import { Role } from '@prisma/client';

export const UserSchema = Yup.object().shape({
    id: Yup.number().integer().min(0).required(),
    email: Yup.string().email().required(),
    firstName: Yup.string().min(1).max(128).required(),
    lastName: Yup.string().min(1).max(128).required(),
    role: Yup.mixed<Role | null>().oneOf(enumToArray(Role)).nullable().default(Role.USER)
        .transform((value: any, input, ctx) => Role[value]
    ),
});
export type User = Yup.InferType<typeof UserSchema>;

export const UserCreateSchema = UserSchema.pick([
    'email',
    'firstName',
    'lastName',
    'role',
]).shape({
    password: Yup.string().min(4).max(128).required(),
});
export type UserCreateData = Yup.InferType<typeof UserCreateSchema>;

export const UserGetSchema = UserSchema.pick([
    'id',
]);

export const UserPatchSchema = Yup.object().shape({
    firstName: Yup.string().min(1).max(128).optional(),
    lastName: Yup.string().min(1).max(128).optional(),
});
export type UserPatchData = Yup.InferType<typeof UserPatchSchema>;

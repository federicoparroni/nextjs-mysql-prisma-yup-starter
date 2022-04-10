import * as Yup from 'yup';
import { enumToArray } from '../utils/types';
import { Role } from '@prisma/client';

export const UserSchema = Yup.object().shape({
    id: Yup.number().integer().min(0).required(),
    email: Yup.string().email().required(),
    firstName: Yup.string().min(1).max(128).required(),
    lastName: Yup.string().min(1).max(128).required(),
    role: Yup.string().uppercase().oneOf(enumToArray(Role)).optional().default(Role.USER),
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
    firstName: UserSchema.fields.firstName.optional(),
    lastName: UserSchema.fields.lastName.optional(),
});
export type UserPatchData = Yup.InferType<typeof UserPatchSchema>;

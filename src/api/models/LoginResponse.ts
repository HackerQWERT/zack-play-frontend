/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthenticatedUser } from './AuthenticatedUser';
export type LoginResponse = {
    accessToken?: string;
    tokenType?: string;
    expiresIn?: number;
    expiresAt?: string;
    user?: AuthenticatedUser;
};


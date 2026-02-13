/** @format */

export type UserRole = "superadmin" | "user";

export type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: UserRole; // you will return this from Laravel
};

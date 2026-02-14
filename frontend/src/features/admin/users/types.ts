/** @format */

export type UserRole =
    | "superadmin"
    | "admin"
    | "manager"
    | "employee"
    | "customer"
    | string;
export type UserStatus = "active" | "suspended" | string;

export type AdminUser = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    profilePic?: string | null;
};

export type PaginatedUsersResponse = {
    users: AdminUser[];
    totalPages: number;
    totalUsers: number;
};

export type CreateUserPayload = {
    name: string;
    email: string;
    role: UserRole;
    password: string;
    password_confirmation: string;
};

export type UpdateUserPayload = {
    name: string;
    email: string;
    role: UserRole;
};

export type UpdatePasswordPayload = {
    password: string;
    password_confirmation: string;
};

export type ToggleStatusPayload = {
    status: UserStatus;
};

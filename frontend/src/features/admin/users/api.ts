/** @format */

import api from "@/src/lib/axios/client";
import type {
    CreateUserPayload,
    PaginatedUsersResponse,
    ToggleStatusPayload,
    UpdatePasswordPayload,
    UpdateUserPayload,
} from "./types";

export const usersApi = {
    list: async (params: { page: number; limit: number; search: string }) => {
        const res = await api.get<PaginatedUsersResponse>("/admin/users", {
            params,
        });
        return res.data;
    },

    create: async (payload: CreateUserPayload) => {
        const res = await api.post("/admin/create-user", payload);
        return res.data;
    },

    update: async (userId: number, payload: UpdateUserPayload) => {
        const res = await api.put(`/admin/users/${userId}`, payload);
        return res.data;
    },

    remove: async (userId: number) => {
        const res = await api.delete(`/admin/users/${userId}`);
        return res.data;
    },

    toggleStatus: async (userId: number, payload: ToggleStatusPayload) => {
        const res = await api.patch(`/admin/users/${userId}/status`, payload);
        return res.data;
    },

    updatePassword: async (userId: number, payload: UpdatePasswordPayload) => {
        const res = await api.patch(`/admin/users/${userId}/password`, payload);
        return res.data;
    },
};

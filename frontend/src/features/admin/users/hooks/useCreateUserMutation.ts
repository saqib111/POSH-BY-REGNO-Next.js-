/** @format */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersApi } from "../api";
import type { CreateUserPayload } from "../types";

export function useCreateUserMutation(opts?: { onClose?: () => void }) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateUserPayload) =>
            usersApi.create(payload),
        onSuccess: async () => {
            toast.success("User created");
            await qc.invalidateQueries({ queryKey: ["adminUsers"] });
            opts?.onClose?.();
        },
        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message || "Failed to create user",
            );
        },
    });
}

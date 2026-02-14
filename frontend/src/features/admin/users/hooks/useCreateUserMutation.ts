/** @format */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api";
import type { CreateUserPayload } from "../types";
import { notify, toastFirstValidationError } from "@/src/lib/toast";

export const useCreateUserMutation = ({
    onClose,
}: { onClose?: () => void } = {}) => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["adminUsers"] });
            notify.success("User created successfully");
            onClose?.();
        },
        onError: (err) => {
            toastFirstValidationError(err);
            notify.error(
                (err as any)?.response?.data?.message ||
                    "Failed to create user",
            );
        },
    });
};

/** @format */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api";
import type { UpdateUserPayload } from "../types";

export const useUpdateUserMutation = ({
    userId,
    onClose,
}: {
    userId: number;
    onClose?: () => void;
}) => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateUserPayload) =>
            usersApi.update(userId, payload),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["adminUsers"] });
            onClose?.();
        },
    });
};

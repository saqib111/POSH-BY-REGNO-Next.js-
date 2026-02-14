/** @format */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api";
import type { UserStatus } from "../types";

export const useUserStatusMutation = ({
    userId,
    nextStatus,
    onClose,
}: {
    userId: number;
    nextStatus: UserStatus;
    onClose?: () => void;
}) => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: () => usersApi.toggleStatus(userId, { status: nextStatus }),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["adminUsers"] });
            onClose?.();
        },
    });
};

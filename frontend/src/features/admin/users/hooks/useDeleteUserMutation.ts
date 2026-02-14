/** @format */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api";

export const useDeleteUserMutation = ({
    userId,
    onClose,
}: {
    userId: number;
    userName?: string;
    onClose?: () => void;
}) => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: () => usersApi.remove(userId),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["adminUsers"] });
            onClose?.();
        },
    });
};

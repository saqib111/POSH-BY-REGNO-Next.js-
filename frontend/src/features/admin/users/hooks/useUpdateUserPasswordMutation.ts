/** @format */

"use client";

import { useMutation } from "@tanstack/react-query";
import { usersApi } from "../api";
import type { UpdatePasswordPayload } from "../types";

export const useUpdateUserPasswordMutation = ({
    userId,
    onClose,
}: {
    userId: number;
    onClose?: () => void;
}) => {
    return useMutation({
        mutationFn: (payload: UpdatePasswordPayload) =>
            usersApi.updatePassword(userId, payload),
        onSuccess: () => {
            onClose?.();
        },
    });
};

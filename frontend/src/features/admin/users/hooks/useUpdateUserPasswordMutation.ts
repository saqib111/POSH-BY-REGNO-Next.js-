/** @format */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersApi } from "../api";
import type { UpdatePasswordPayload } from "../types";

type Vars = { userId: number; payload: UpdatePasswordPayload };

export function useUpdateUserPasswordMutation(opts?: { onClose?: () => void }) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, payload }: Vars) =>
            usersApi.updatePassword(userId, payload),
        onSuccess: async () => {
            toast.success("Password updated");
            await qc.invalidateQueries({ queryKey: ["adminUsers"] });
            opts?.onClose?.();
        },
        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message || "Failed to update password",
            );
        },
    });
}

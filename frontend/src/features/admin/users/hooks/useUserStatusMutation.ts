/** @format */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersApi } from "../api";
import type { UserStatus } from "../types";

type Vars = { userId: number; nextStatus: UserStatus };

export function useUserStatusMutation(opts?: { onClose?: () => void }) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, nextStatus }: Vars) =>
            usersApi.toggleStatus(userId, { status: nextStatus }),
        onSuccess: async () => {
            toast.success("Status updated");
            await qc.invalidateQueries({ queryKey: ["adminUsers"] });
            opts?.onClose?.();
        },
        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message || "Failed to update status",
            );
        },
    });
}

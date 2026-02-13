/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as AuthAPI from "./api";

export function useMe() {
    return useQuery({
        queryKey: ["me"],
        queryFn: AuthAPI.me,
        retry: false,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false,
    });
}

export function useLogin() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: AuthAPI.login,
        onSuccess: async () => {
            // refresh me after login
            await qc.invalidateQueries({ queryKey: ["me"] });
        },
    });
}

export function useRegister() {
    return useMutation({
        mutationFn: AuthAPI.register,
    });
}

export function useLogout() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: AuthAPI.logout,
        onMutate: async () => {
            // ✅ stop /me refetch while logging out
            await qc.cancelQueries({ queryKey: ["me"] });

            // ✅ instantly remove cached user
            qc.setQueryData(["me"], null);
        },
        onSuccess: async () => {
            // ✅ ensure it's cleared
            qc.removeQueries({ queryKey: ["me"], exact: true });
        },
        onSettled: async () => {
            // ✅ keep state consistent
            await qc.invalidateQueries({ queryKey: ["me"] });
        },
    });
}

export function useForgotPassword() {
    return useMutation({
        mutationFn: AuthAPI.forgotPassword,
    });
}

export function useVerifyResetOtp() {
    return useMutation({
        mutationFn: AuthAPI.verifyResetOtp,
    });
}

export function useResetPassword() {
    return useMutation({
        mutationFn: AuthAPI.resetPassword,
    });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createCategory } from "../api";
import type { CreateCategoryPayload } from "../types";

export const useCreateCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),

        onSuccess: async (response) => {
            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            toast.success(
                response.message || "Category created successfully."
            );
        },

        onError: (error: any) => {
            const hasValidationErrors = !!error?.response?.data?.errors;

            if (!hasValidationErrors) {
                toast.error(
                    error?.response?.data?.message ||
                        "Failed to create category."
                );
            }
        },
    });
};
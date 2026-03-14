import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createSubCategory } from "../api";
import type { CreateSubCategoryPayload } from "../types";

export const useCreateSubCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateSubCategoryPayload) => createSubCategory(payload),

        onSuccess: async (response) => {
            await queryClient.invalidateQueries({
                queryKey: ["sub-categories"],
            });

            toast.success(
                response.message || "Sub-category created successfully."
            );
        },

        onError: (error: any) => {
            const hasValidationErrors = !!error?.response?.data?.errors;

            if (!hasValidationErrors) {
                toast.error(
                    error?.response?.data?.message ||
                        "Failed to create sub-category."
                );
            }
        },
    });
};
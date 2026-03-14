import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCategory } from "../api";
import type { UpdateCategoryPayload } from "../types";

type UseUpdateCategoryMutationProps = {
    categoryId: number;
    onClose?: () => void;
};

export const useUpdateCategoryMutation = ({
    categoryId,
    onClose,
}: UseUpdateCategoryMutationProps) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateCategoryPayload) =>
            updateCategory(categoryId, payload),

        onSuccess: async (response) => {
            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            toast.success(
                response.message || "Category updated successfully."
            );

            onClose?.();
        },

        onError: (error: any) => {
            const hasValidationErrors = !!error?.response?.data?.errors;

            if (!hasValidationErrors) {
                toast.error(
                    error?.response?.data?.message ||
                        "Failed to update category."
                );
            }
        },
    });
};
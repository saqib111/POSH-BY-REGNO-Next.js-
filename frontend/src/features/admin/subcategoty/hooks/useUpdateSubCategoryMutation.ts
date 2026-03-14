import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSubCategory } from "../api";
import type { UpdateSubCategoryPayload } from "../types";

type UseUpdateSubCategoryMutationProps = {
    subCategoryId: number;
    onClose?: () => void;
};

export const useUpdateSubCategoryMutation = ({
    subCategoryId,
    onClose,
}: UseUpdateSubCategoryMutationProps) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateSubCategoryPayload) =>
            updateSubCategory(subCategoryId, payload),

        onSuccess: async (response) => {
            await queryClient.invalidateQueries({
                queryKey: ["sub-categories"],
            });

            toast.success(
                response.message || "Sub-category updated successfully."
            );

            onClose?.();
        },

        onError: (error: any) => {
            const hasValidationErrors = !!error?.response?.data?.errors;

            if (!hasValidationErrors) {
                toast.error(
                    error?.response?.data?.message ||
                        "Failed to update sub-category."
                );
            }
        },
    });
};
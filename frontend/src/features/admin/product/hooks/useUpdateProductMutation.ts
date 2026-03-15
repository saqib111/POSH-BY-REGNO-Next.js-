import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateProduct } from "../api";
import type { UpdateProductPayload } from "../types";

type UseUpdateProductMutationProps = {
    productId: number;
    onClose?: () => void;
};

export const useUpdateProductMutation = ({
    productId,
    onClose,
}: UseUpdateProductMutationProps) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateProductPayload) =>
            updateProduct(productId, payload),

        onSuccess: async (response) => {
            await queryClient.invalidateQueries({
                queryKey: ["products"],
            });

            toast.success(
                response.message || "Product updated successfully."
            );

            onClose?.();
        },

        onError: (error: any) => {
            const hasValidationErrors = !!error?.response?.data?.errors;

            if (!hasValidationErrors) {
                toast.error(
                    error?.response?.data?.message ||
                        "Failed to update product."
                );
            }
        },
    });
};
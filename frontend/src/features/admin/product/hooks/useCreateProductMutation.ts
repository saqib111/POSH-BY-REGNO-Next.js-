import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createProduct } from "../api";
import type { CreateProductPayload } from "../types";

export const useCreateProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateProductPayload) => createProduct(payload),

        onSuccess: async (response) => {
            await queryClient.invalidateQueries({
                queryKey: ["products"],
            });

            toast.success(response.message || "Product created successfully.");
        },

        onError: (error: any) => {
            const hasValidationErrors = !!error?.response?.data?.errors;

            if (!hasValidationErrors) {
                toast.error(
                    error?.response?.data?.message || "Failed to create product."
                );
            }
        },
    });
};
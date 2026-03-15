import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteProduct } from "../api";

type UseDeleteProductMutationProps = {
    productId: number;
    productName?: string;
    onClose?: () => void;
};

export const useDeleteProductMutation = ({
    productId,
    productName,
    onClose,
}: UseDeleteProductMutationProps) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteProduct(productId),

        onSuccess: async (response) => {
            await queryClient.invalidateQueries({
                queryKey: ["products"],
            });

            toast.success(
                response.message ||
                    `${productName || "Product"} deleted successfully.`
            );

            onClose?.();
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                    "Failed to delete product."
            );
        },
    });
};
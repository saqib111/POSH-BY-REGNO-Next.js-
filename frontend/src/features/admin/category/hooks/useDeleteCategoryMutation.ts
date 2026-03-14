import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCategory } from "../api";

type UseDeleteCategoryMutationProps = {
    categoryId: number;
    categoryName?: string;
};

export const useDeleteCategoryMutation = ({
    categoryId,
    categoryName,
}: UseDeleteCategoryMutationProps) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteCategory(categoryId),

        onSuccess: async (response) => {
            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            toast.success(
                response.message || 
                `${categoryName || "Category"} deleted successfully.`
            );
        }, 

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || "Failed to delete category."
            );
        },
    })
}
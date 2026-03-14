import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteSubCategory } from "../api";

type UseDeleteSubCategoryMutationProps = {
    subCategoryId: number;
    subCategoryName?: string;
    onClose?: () => void;
};

export const useDeleteSubCategoryMutation = ({
    subCategoryId,
    subCategoryName,
    onClose,
}: UseDeleteSubCategoryMutationProps) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteSubCategory(subCategoryId),

        onSuccess: async (response) => {
            await queryClient.invalidateQueries({
                queryKey: ["sub-categories"],
            });

            toast.success(
                response.message ||
                    `${subCategoryName || "Sub-category"} deleted successfully.`
            );

            onClose?.();
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                    "Failed to delete sub-category."
            );
        },
    });
};
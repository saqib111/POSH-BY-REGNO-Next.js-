import { useInfiniteQuery } from "@tanstack/react-query";
import { getProductSubCategoryOptions } from "../api";

type UseInfiniteProductSubCategoryOptionsQueryProps = {
    categoryId: number | null;
    search: string;
    limit?: number;
};

export const useInfiniteProductSubCategoryOptionsQuery = ({
    categoryId,
    search,
    limit = 5,
}: UseInfiniteProductSubCategoryOptionsQueryProps) => {
    return useInfiniteQuery({
        queryKey: [
            "product-sub-category-options-infinite",
            categoryId,
            search,
            limit,
        ],
        queryFn: ({ pageParam = 1 }) => {
            if (!categoryId) {
                throw new Error("Category is required");
            }

            return getProductSubCategoryOptions({
                category_id: categoryId,
                search,
                page: pageParam,
                limit,
            });
        },
        initialPageParam: 1,
        enabled: !!categoryId,
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore
                ? lastPage.currentPage + 1
                : undefined;
        },
    });
};
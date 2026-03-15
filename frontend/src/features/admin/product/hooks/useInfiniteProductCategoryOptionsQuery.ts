import { useInfiniteQuery } from "@tanstack/react-query";
import { getProductCategoryOptions } from "../api";

type UseInfiniteProductCategoryOptionsQueryProps = {
    search: string;
    limit?: number;
};

export const useInfiniteProductCategoryOptionsQuery = ({
    search,
    limit = 5,
}: UseInfiniteProductCategoryOptionsQueryProps) => {
    return useInfiniteQuery({
        queryKey: ["product-category-options-infinite", search, limit],
        queryFn: ({ pageParam = 1 }) =>
            getProductCategoryOptions({
                search,
                page: pageParam,
                limit,
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore
                ? lastPage.currentPage + 1
                : undefined;
        },
    });
};
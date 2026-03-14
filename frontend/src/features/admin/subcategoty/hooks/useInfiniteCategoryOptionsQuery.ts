import { useInfiniteQuery } from "@tanstack/react-query";
import { getCategoryOptions } from "../api";

type UseInfiniteCategoryOptionsQueryProps = {
    search: string;
    limit?: number;
};

export const useInfiniteCategoryOptionsQuery = ({
    search,
    limit = 5,
}: UseInfiniteCategoryOptionsQueryProps) => {
    return useInfiniteQuery({
        queryKey: ["sub-category-category-options-infinite", search, limit],
        queryFn: ({ pageParam = 1 }) =>
            getCategoryOptions({
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
import { useQuery } from "@tanstack/react-query";
import { getCategoryOptions } from "../api";
import type { GetCategoryOptionsParams } from "../types";

export const useCategoryOptionsQuery = (
    params: GetCategoryOptionsParams
) => {
    return useQuery({
        queryKey: ["Sub-category-category-options", params],
        queryFn: () => getCategoryOptions(params),
    });
};
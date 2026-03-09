import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api";
import type { GetCategoriesParams } from "../types";

export const useCategoriesQuery = (params: GetCategoriesParams) => {
    return useQuery({
        queryKey: ["categories", params],
        queryFn: () => getCategories(params),
    });
}
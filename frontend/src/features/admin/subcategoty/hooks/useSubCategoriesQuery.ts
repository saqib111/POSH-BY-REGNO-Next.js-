import { useQuery } from "@tanstack/react-query";
import { getSubCategories } from "../api";
import { GetSubCategoriesParam } from "../types";

export const useSubCategoriesQuery = (
    params: GetSubCategoriesParam
) => {
    return useQuery({
        queryKey: ['sub-categories', params],
        queryFn: () => getSubCategories(params),
    });
};
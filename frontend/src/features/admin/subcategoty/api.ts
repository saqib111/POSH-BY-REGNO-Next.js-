import api from "@/src/lib/axios/client";
import { GetSubCategoriesParam, GetSubCategoriesResponse } from "./types";

export const getSubCategories = async (
    params: GetSubCategoriesParam
): Promise<GetSubCategoriesResponse> => {
    const response = await api.get<GetSubCategoriesResponse>(
        "admin/sub-categories",
        {
            params,
        }
    );

    return response.data;
};
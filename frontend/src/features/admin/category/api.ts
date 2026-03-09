import api from "@/src/lib/axios/client";
import type { CreateCategoryPayload, CreateCategoryResponse, GetCategoriesParams, GetCategoriesResponse } from "./types";

export const getCategories = async (
    params: GetCategoriesParams
): Promise<GetCategoriesResponse> => {
    const response = await api.get<GetCategoriesResponse>(
        "/admin/categories",
        {
            params,
        }
    );

    return response.data;
};

// *************************************************

export const createCategory = async (
    payload: CreateCategoryPayload
): Promise<CreateCategoryResponse> => {
        const response = await api.post<CreateCategoryResponse>(
            "/admin/categories",
            payload
        );

        return response.data;
};


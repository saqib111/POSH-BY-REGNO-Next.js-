import api from "@/src/lib/axios/client";
import type {
    CreateCategoryPayload,
    CreateCategoryResponse,
    DeleteCategoryResponse,
    GetCategoriesParams,
    GetCategoriesResponse,
} from "./types";

export const getCategories = async (
    params: GetCategoriesParams,
): Promise<GetCategoriesResponse> => {
    const response = await api.get<GetCategoriesResponse>("/admin/categories", {
        params,
    });

    return response.data;
};

// ******************** Create Category API *****************************

export const createCategory = async (
    payload: CreateCategoryPayload,
): Promise<CreateCategoryResponse> => {
    const response = await api.post<CreateCategoryResponse>(
        "/admin/categories",
        payload,
    );

    return response.data;
};

// ******************** Delete Category API *****************************

export const deleteCategory = async (
    categoryId: number,
): Promise<DeleteCategoryResponse> => {
    const response = await api.delete<DeleteCategoryResponse>(
        `/admin/categories/${categoryId}`,
    );

    return response.data;
};

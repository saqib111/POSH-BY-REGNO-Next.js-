import api from "@/src/lib/axios/client";
import {
    CreateSubCategoryPayload,
    CreateSubCategoryResponse,
    DeleteSubCategoryResponse,
    GetCategoryOptionsResponse,
    GetSubCategoriesParam,
    GetSubCategoriesResponse,
    UpdateSubCategoryPayload,
    UpdateSubCategoryResponse,
} from "./types";
import { GetCategoriesParams } from "../category/types";

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

// ******************** Create Sub-Category API *****************************

export const getCategoryOptions = async (
    params: GetCategoriesParams
): Promise<GetCategoryOptionsResponse> => {
    const response = await api.get<GetCategoryOptionsResponse>("/admin/sub-categories/category-options",
        {
            params,
        }
    );
    return response.data;
};

export const createSubCategory = async (
    payload: CreateSubCategoryPayload
): Promise<CreateSubCategoryResponse> => {
    const response = await api.post<CreateSubCategoryResponse>(
        "/admin/sub-categories/create",
        payload
    );
    return response.data;
};

// ******************** Delete Sub-Category API *****************************

export const deleteSubCategory = async (
    subCategoryId: number
): Promise<DeleteSubCategoryResponse> => {
    const response = await api.delete<DeleteSubCategoryResponse>(
        `/admin/sub-categories/${subCategoryId}`
    );

    return response.data;
};

// ******************** Update Sub-Category API *****************************

export const updateSubCategory = async (
    subCategoryId: number,
    payload: UpdateSubCategoryPayload
): Promise<UpdateSubCategoryResponse> => {
    const response = await api.put<UpdateSubCategoryResponse>(
        `/admin/sub-categories/${subCategoryId}`,
        payload
    );

    return response.data;
};
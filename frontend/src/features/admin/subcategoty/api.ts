import api from "@/src/lib/axios/client";
import {
    CreateSubCategoryPayload,
    CreateSubCategoryResponse,
    GetCategoryOptionsResponse,
    GetSubCategoriesParam,
    GetSubCategoriesResponse
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
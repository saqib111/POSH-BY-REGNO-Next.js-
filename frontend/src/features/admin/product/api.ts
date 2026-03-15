import api from "@/src/lib/axios/client"
import { 
    CreateProductPayload, 
    CreateProductResponse, 
    GetProductCategoryOptionsParams, 
    GetProductCategoryOptionsResponse, 
    GetProductSubCategoryOptionsParams, 
    GetProductSubCategoryOptionsResponse, 
    GetProductsParams, 
    GetProductsResponse, 
} from "./types";

// ******************** Fetch Products API *****************************
export const getProducts = async (
    params: GetProductsParams
): Promise<GetProductsResponse> => {
    const response = await api.get<GetProductsResponse>("/admin/products", {
        params,
    });

    return response.data;
};

// ******************** Create Products API *****************************

export const getProductCategoryOptions = async (
    params: GetProductCategoryOptionsParams
): Promise<GetProductCategoryOptionsResponse> => {
    const response = await api.get<GetProductCategoryOptionsResponse>(
        "/admin/products/category-options",
        {
            params,
        }
    );

    return response.data;
};

export const getProductSubCategoryOptions = async (
    params: GetProductSubCategoryOptionsParams
): Promise<GetProductSubCategoryOptionsResponse> => {
    const response = await api.get<GetProductSubCategoryOptionsResponse>(
        "/admin/products/sub-category-options",
        {
            params,
        }
    );

    return response.data;
};

export const createProduct = async (
    payload: CreateProductPayload
): Promise<CreateProductResponse> => {
    const response = await api.post<CreateProductResponse>(
        "/admin/products/create",
        payload
    );

    return response.data;
};
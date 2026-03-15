import api from "@/src/lib/axios/client"
import { GetProductsParams, GetProductsResponse } from "./types";

// ******************** Fetch Products API *****************************
export const getProducts = async (
    params: GetProductsParams
): Promise<GetProductsResponse> => {
    const response = await api.get<GetProductsResponse>("/admin/products", {
        params,
    });

    return response.data;
};
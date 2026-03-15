import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api";
import { GetProductsParams } from "../types";

export const useProductsQuery = (params: GetProductsParams) => {
    return useQuery({
        queryKey: ["products", params],
        queryFn: () => getProducts(params),
    });
};
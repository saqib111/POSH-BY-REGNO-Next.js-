// *************************************************
// Fetch Product Types
// *************************************************
export type Product = {
    id: number;
    category_id: number;
    sub_category_id: number;
    category_name: string;
    sub_category_name: string;
    product_name: string;
    sku: string | null;
    status: number;
    created_at: string;
};

export type GetProductsResponse = {
    status: string;
    products: Product[];
    totalPages: number;
    totalProducts: number;
    currentPage: number;
};

export type GetProductsParams = {
    search?: string;
    page?: number;
    limit?: number;
};
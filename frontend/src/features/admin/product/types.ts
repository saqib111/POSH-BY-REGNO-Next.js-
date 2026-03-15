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

// *************************************************
// Create Product Types
// *************************************************

export type ProductOption = {
    value: number;
    label: string;
};

export type GetProductCategoryOptionsParams = {
    search?: string;
    page?: number;
    limit?: number;
};

export type GetProductCategoryOptionsResponse = {
    status: string;
    options: ProductOption[];
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
};

export type GetProductSubCategoryOptionsParams = {
    category_id: number;
    search?: string;
    page?: number;
    limit?: number;
};

export type GetProductSubCategoryOptionsResponse = {
    status: string;
    options: ProductOption[];
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
};

export type CreateProductPayload = {
    category_id: number;
    sub_category_id: number;
    product_name: string;
    sku: string | null;
};

export type CreateProductResponse = {
    status: string;
    message: string;
    product: {
        id: number;
        category_id: number;
        sub_category_id: number;
        product_name: string;
        sku: string | null;
        status: number;
        created_at: string;
        updated_at: string;
    };
};

// *************************************************
// Delete Product Types
// *************************************************

export type DeleteProductResponse = {
    status: string;
    message: string;
    product: string;
};

// *************************************************
// Update Product Types
// *************************************************

export type UpdateProductPayload = {
    category_id: number;
    sub_category_id: number;
    product_name: string;
    sku: string | null;
};

export type UpdateProductResponse = {
    status: string;
    message: string;
    product: {
        id: number;
        category_id: number;
        sub_category_id: number;
        product_name: string;
        sku: string | null;
        status: number;
        created_at: string;
        updated_at: string;
    };
};
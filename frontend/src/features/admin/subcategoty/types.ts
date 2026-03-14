// *************************************************
// Fetch Sub-Category Types
// *************************************************
export type SubCategory = {
    id: number;
    category_id: number;
    category_name: string;
    sub_category_name: string;
    status: "active" | "inactive";
    created_at: string;
};

export type GetSubCategoriesResponse = {
    status: string;
    subCategories: SubCategory[];
    totalPages: number;
    totalSubCategories: number;
    currentPage: number;
};

export type GetSubCategoriesParam = {
    search?: string;
    page?: number;
    limit?: number;
};

// *************************************************
// Create Sub-Category Types
// *************************************************

export type CategoryOption = {
    value: number;
    label: string;
};

export type GetCategoryOptionsParams = {
    search?: string;
    page?: number;
    limit?: number;
};

export type GetCategoryOptionsResponse = {
    status: string;
    options: CategoryOption[];
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
};

export type CreateSubCategoryPayload = {
    category_id: number;
    sub_category_name: string;
};

export type CreateSubCategoryResponse = {
    status: string;
    message: string;
    sub_category: {
        id: number;
        category_id: number;
        sub_category_name: string;
        status: "active" | "inactive";
        created_at: string;
        updated_at: string;
    };
};

// *************************************************
// Delete Sub-Category Types
// *************************************************

export type DeleteSubCategoryResponse = {
    status: string;
    message: string;
    "sub-category": string;
};

// *************************************************
// Update Sub-Category Types
// *************************************************

export type UpdateSubCategoryPayload = {
    category_id: number;
    sub_category_name: string;
};

export type UpdateSubCategoryResponse = {
    status: string;
    message: string;
    sub_category: {
        id: number;
        category_id: number;
        sub_category_name: string;
        status: "active" | "inactive";
        created_at: string;
        updated_at: string;
    };
};
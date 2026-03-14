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
export type Category = {
    id: number;
    category_name: string;
    created_at: string;
}

export type GetCategoriesResponse = {
    status: string;
    categories: Category[];
    totalPages: number;
    totalCategories: number;
    currentPage: number;
}

export type GetCategoriesParams = {
    search?: string;
    page?: number;
    limit?: number;
}
// *************************************************
// =================================================
// *************************************************


// Create Category Types
export type CreateCategoryPayload = {
    category_name: string;
};

export type CreateCategoryResponse = {
    status: string;
    message: string;
    category: {
        id: number;
        category_name : string;
        status: "active" | "inactive";
        created_at: string;
        updated_at: string;
    }    
}

// *************************************************
// =================================================
// *************************************************

// Delete Category Types
export type DeleteCategoryResponse = {
    status: string;
    message: string;
}
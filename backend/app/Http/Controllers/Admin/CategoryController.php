<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /**
     * READ (Paginated + Search)
     * GET /api/admin/categories?search=abc&limit=10&page=1
     */
    public function index(Request $request)
    {
        // 1. Inputs from React (Search, Page, Limit)
        $search = $request->input('search');
        $limit = (int) $request->input('limit', 10);

        // Safety limit to avoid crazy requests like limit=100000
        $limit = max(1, min($limit, 100));

        // 2. Start query with only necessary columns
        $query = Category::query()
            ->select(['id', 'category_name', 'created_at']);

        // 3. Optimized Search Logic
        $query->when($search, function ($q) use ($search) {
            return $q->where('category_name', 'LIKE', "%{$search}%");
        });

        // 4. Sorting
        $query->orderBy('id', 'asc');

        // 5. Pagination
        $categories = $query->paginate($limit);

        // 6. Return Structured JSON (similar to your users)
        return response()->json([
            'status' => 'success',
            'categories' => $categories->items(),
            'totalPages' => $categories->lastPage(),
            'totalCategories' => $categories->total(),
            'currentPage' => $categories->currentPage(),
        ], 200);
    }

    /**
     * CREATE
     * POST /api/admin/categories
     * body: { category_name: "HR" }
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_name' => ['required', 'string', 'max:255', 'unique:categories,category_name'],
        ]);

        $category = Category::create([
            'category_name' => $validated['category_name'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Category created successfully.',
            'category' => $category,
        ], 201);
    }

    /**
     * UPDATE
     * PUT /api/admin/categories/{category}
     * body: { category_name: "Updated Name" }
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'category_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'category_name')->ignore($category->id),
            ],
        ]);

        $category->update([
            'category_name' => $validated['category_name'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Category updated successfully.',
            'category' => $category,
        ], 200);
    }

    /**
     * DELETE
     * DELETE /api/admin/categories/{category}
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Category deleted successfully.',
        ], 200);
    }
}

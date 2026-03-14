<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubCategories;
use Illuminate\Http\Request;
use App\Models\Category;

class SubCategoriesController extends Controller
{
    public function categoryOptions(Request $request)
    {
        $search = $request->input('search', '');
        $limit = (int) $request->input('limit', 7);

        $query = Category::query()->select(['id', 'category_name']);

        if ($search !== '') {
            $query->where('category_name', 'LIKE', "%{$search}%");
        }

        $query->orderBy('id', 'asc');

        $cats = $query->paginate($limit);

        return response()->json([
            'status' => 'success',
            'options' => collect($cats->items())->map(fn($c) => [
                'value' => $c->id,
                'label' => $c->category_name,
            ]),
            'currentPage' => $cats->currentPage(),
            'totalPages' => $cats->lastPage(),
            'hasMore' => $cats->currentPage() < $cats->lastPage(),
        ], 200);
    }

    public function createSubCategory(Request $request)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'integer'],
            'sub_category_name' => ['required', 'string', 'max:255', 'unique:sub_categories,sub_category_name'],
        ]);

        $subCategory = SubCategories::create([
            'category_id' => $validated['category_id'],
            'sub_category_name' => $validated['sub_category_name'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Sub-Category created successfully',
            'sub_category' => $subCategory
        ], 201);
    }

    public function viewSubCategory(Request $request)
    {
        // 1. Inputs
        $search = $request->input('search');
        $limit = (int) $request->input('limit', 10);

        // Safety limit
        $limit = max(1, min($limit, 100));

        // 2. Query with join to categories
        $query = SubCategories::query()
            ->select([
                'sub_categories.id',
                'sub_categories.category_id',
                'categories.category_name as category_name',
                'sub_categories.sub_category_name',
                'sub_categories.status',
                'sub_categories.created_at',
            ])
            ->join('categories', 'categories.id', '=', 'sub_categories.category_id');

        // 3. Search (sub-category OR category name)
        $query->when($search, function ($q) use ($search) {
            $q->where('sub_categories.sub_category_name', 'LIKE', "%{$search}%")
                ->orWhere('categories.category_name', 'LIKE', "%{$search}%");
        });

        // 4. Sorting
        $query->orderBy('sub_categories.id', 'asc');

        // 5. Pagination
        $subCategories = $query->paginate($limit);

        // 6. Response
        return response()->json([
            'status' => 'success',
            'subCategories' => $subCategories->items(),
            'totalPages' => $subCategories->lastPage(),
            'totalSubCategories' => $subCategories->total(),
            'currentPage' => $subCategories->currentPage(),
        ], 200);

    }

    public function updateSubCategory(Request $request, $id)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'sub_category_name' => [
                'required',
                'string',
                'max:255',
                'unique:sub_categories,sub_category_name,' . $id
            ],
        ]);

        $subCategory = SubCategories::find($id);

        if (!$subCategory) {
            return response()->json([
                'status' => 'error',
                'message' => 'Sub-category not found'
            ], 404);
        }

        $subCategory->update([
            'category_id' => $validated['category_id'],
            'sub_category_name' => $validated['sub_category_name'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Sub-category updated successfully',
            'sub_category' => $subCategory
        ], 200);
    }

    public function deleteSubCategory($id)
    {
        validator(['id' => $id], [
            'id' => ['required', 'integer', 'exists:sub_categories,id'],
        ])->validate();

        $subCategory = SubCategories::find($id);

        $subCategory->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Sub-category has been deleted successfully',
            'sub-category' => $subCategory->sub_category_name,
        ], 200);
    }

}

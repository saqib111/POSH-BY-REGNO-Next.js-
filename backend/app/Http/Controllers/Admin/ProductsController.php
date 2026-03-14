<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\SubCategories;

class ProductsController extends Controller
{
    // ✅ Category dropdown options for Product forms
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

    // ✅ SubCategory dropdown options (depends on category_id)
    public function subCategoryOptions(Request $request)
    {
        $categoryId = $request->input('category_id');
        $search = $request->input('search', '');
        $limit = (int) $request->input('limit', 7);

        validator(['category_id' => $categoryId], [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
        ])->validate();

        $query = SubCategories::query()
            ->select(['id', 'sub_category_name'])
            ->where('category_id', $categoryId);

        if ($search !== '') {
            $query->where('sub_category_name', 'LIKE', "%{$search}%");
        }

        $query->orderBy('id', 'asc');

        $subs = $query->paginate($limit);

        return response()->json([
            'status' => 'success',
            'options' => collect($subs->items())->map(fn($s) => [
                'value' => $s->id,
                'label' => $s->sub_category_name,
            ]),
            'currentPage' => $subs->currentPage(),
            'totalPages' => $subs->lastPage(),
            'hasMore' => $subs->currentPage() < $subs->lastPage(),
        ], 200);
    }

    public function createProduct(Request $request)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'sub_category_id' => ['required', 'integer', 'exists:sub_categories,id'],
            'product_name' => ['required', 'string', 'max:255', 'unique:products,product_name'],
            'sku' => ['nullable', 'string', 'max:100', 'unique:products,sku'],
        ]);

        // ✅ ensure sub-category belongs to category (critical rule)
        $subOk = SubCategories::where('id', $validated['sub_category_id'])
            ->where('category_id', $validated['category_id'])
            ->exists();

        if (!$subOk) {
            return response()->json([
                'status' => 'error',
                'message' => 'Selected sub-category does not belong to selected category.',
                'errors' => [
                    'sub_category_id' => ['Invalid sub-category for the selected category.'],
                ],
            ], 422);
        }

        $product = Product::create([
            'category_id' => $validated['category_id'],
            'sub_category_id' => $validated['sub_category_id'],
            'product_name' => $validated['product_name'],
            'sku' => $validated['sku'] ?? null,
            'status' => 1,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Product created successfully',
            'product' => $product,
        ], 201);
    }

    public function viewProducts(Request $request)
    {
        $search = $request->input('search');
        $limit = (int) $request->input('limit', 10);

        // Safety limit
        $limit = max(1, min($limit, 100));

        $query = Product::query()
            ->select([
                'products.id',
                'products.category_id',
                'products.sub_category_id',
                'categories.category_name as category_name',
                'sub_categories.sub_category_name as sub_category_name',
                'products.product_name',
                'products.sku',
                'products.status',
                'products.created_at',
            ])
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->join('sub_categories', 'sub_categories.id', '=', 'products.sub_category_id');

        $query->when($search, function ($q) use ($search) {
            $q->where('products.product_name', 'LIKE', "%{$search}%")
                ->orWhere('products.sku', 'LIKE', "%{$search}%")
                ->orWhere('categories.category_name', 'LIKE', "%{$search}%")
                ->orWhere('sub_categories.sub_category_name', 'LIKE', "%{$search}%");
        });

        $query->orderBy('products.id', 'asc');

        $products = $query->paginate($limit);

        return response()->json([
            'status' => 'success',
            'products' => $products->items(),
            'totalPages' => $products->lastPage(),
            'totalProducts' => $products->total(),
            'currentPage' => $products->currentPage(),
        ], 200);
    }

    public function updateProduct(Request $request, $id)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'sub_category_id' => ['required', 'integer', 'exists:sub_categories,id'],
            'product_name' => [
                'required',
                'string',
                'max:255',
                'unique:products,product_name,' . $id
            ],
            'sku' => [
                'nullable',
                'string',
                'max:100',
                'unique:products,sku,' . $id
            ],
        ]);

        // ✅ ensure sub-category belongs to category
        $subOk = SubCategories::where('id', $validated['sub_category_id'])
            ->where('category_id', $validated['category_id'])
            ->exists();

        if (!$subOk) {
            return response()->json([
                'status' => 'error',
                'message' => 'Selected sub-category does not belong to selected category.',
                'errors' => [
                    'sub_category_id' => ['Invalid sub-category for the selected category.'],
                ],
            ], 422);
        }

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }

        $product->update([
            'category_id' => $validated['category_id'],
            'sub_category_id' => $validated['sub_category_id'],
            'product_name' => $validated['product_name'],
            'sku' => $validated['sku'] ?? null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Product updated successfully',
            'product' => $product
        ], 200);
    }

    public function deleteProduct($id)
    {
        validator(['id' => $id], [
            'id' => ['required', 'integer', 'exists:products,id'],
        ])->validate();

        $product = Product::find($id);

        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Product has been deleted successfully',
            'product' => $product->product_name,
        ], 200);
    }
}

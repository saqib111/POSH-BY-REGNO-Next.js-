<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        'category_id',
        'sub_category_id',
        'product_name',
        'sku',
        'status',
    ];

    // Optional relationship (good for future)
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function subCategory()
    {
        return $this->belongsTo(\App\Models\SubCategories::class, 'sub_category_id');
    }
}

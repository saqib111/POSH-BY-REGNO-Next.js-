<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\SubCategories;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $productNames = [
            'Leather Jacket',
            'Leather Belt',
            'Leather Bag',
            'Leather Wallet',
            'Leather Boots',
            'Leather Shoes',
            'Leather Backpack',
            'Leather Briefcase',
            'Leather Sofa',
            'Leather Chair',
            'Leather Watch Strap',
            'Leather Gloves',
            'Leather Phone Case',
            'Leather Travel Bag',
            'Leather Organizer',
        ];

        $categories = Category::with('subCategories')->get();

        if ($categories->isEmpty()) {
            $this->command->warn('No categories found.');
            return;
        }

        foreach ($categories as $category) {
            if ($category->subCategories->isEmpty()) {
                continue;
            }

            foreach ($category->subCategories as $subCategory) {
                // Each sub-category gets 20–50 products
                $count = rand(20, 50);

                for ($i = 1; $i <= $count; $i++) {
                    $name = $productNames[array_rand($productNames)];

                    Product::create([
                        'category_id' => $category->id,
                        'sub_category_id' => $subCategory->id,
                        'product_name' =>
                            $name .
                            ' ' .
                            strtoupper(Str::random(4)) .
                            '-' .
                            $subCategory->id .
                            '-' .
                            $i,
                        'sku' =>
                            'SKU-' .
                            strtoupper(Str::random(8)),
                        'status' => 1,
                    ]);
                }
            }
        }
    }
}

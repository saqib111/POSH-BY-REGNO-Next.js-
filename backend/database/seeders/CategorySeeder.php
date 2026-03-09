<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Arr;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Predefined leather product categories
        $leatherCategories = [
            'Leather Jackets',
            'Leather Belts',
            'Leather Bags',
            'Leather Wallets',
            'Leather Shoes',
            'Leather Boots',
            'Leather Gloves',
            'Leather Hats',
            'Leather Pants',
            'Leather Skirts',
            'Leather Accessories',
            'Leather Sofas',
            'Leather Chairs',
            'Leather Car Seats',
            'Leather Briefcases',
            'Leather Backpacks',
            'Leather Keychains',
            'Leather Phone Cases',
            'Leather Watch Straps',
            'Leather Notebook Covers',
        ];

        // Generate 200 records randomly from the above categories
        for ($i = 1; $i <= 200; $i++) {
            Category::create([
                'category_name' => Arr::random($leatherCategories) . ' ' . $i, // append number to make unique
                'status' => 'active',
            ]);
        }
    }
}

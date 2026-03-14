<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubCategories;
use App\Models\Category;
use Illuminate\Support\Arr;

class SubCategorySeeder extends Seeder
{
    public function run(): void
    {
        $subCategoryTemplates = [
            'Classic',
            'Premium',
            'Vintage',
            'Handcrafted',
            'Luxury',
            'Modern',
            'Slim Fit',
            'Heavy Duty',
            'Travel',
            'Outdoor',
            'Business',
            'Casual',
            'Designer',
            'Limited Edition',
            'Eco Friendly',
        ];

        $categories = Category::all();

        if ($categories->isEmpty()) {
            $this->command->warn('No categories found. Seed categories first.');
            return;
        }

        foreach ($categories as $category) {
            // Each category gets 5–12 sub-categories
            $count = rand(5, 12);

            for ($i = 1; $i <= $count; $i++) {
                SubCategories::create([
                    'category_id' => $category->id,
                    'sub_category_name' =>
                        Arr::random($subCategoryTemplates) .
                        ' ' .
                        $category->id .
                        '-' .
                        $i,
                    'status' => 1,
                ]);
            }
        }
    }
}

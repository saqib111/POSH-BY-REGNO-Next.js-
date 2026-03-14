<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            // ✅ Parent taxonomy references
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('sub_category_id');

            // ✅ Product fields
            $table->string('product_name', 255)->unique();
            $table->string('sku', 100)->nullable()->unique();

            // ✅ 1=active, 0=inactive (same style as your other tables)
            $table->tinyInteger('status')->default(1);

            $table->timestamps();

            // ✅ Foreign Keys
            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->onDelete('cascade');

            $table->foreign('sub_category_id')
                ->references('id')
                ->on('sub_categories')
                ->onDelete('cascade');

            // ✅ Optional (recommended) indexes
            $table->index('category_id');
            $table->index('sub_category_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

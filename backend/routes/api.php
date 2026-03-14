<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\SubCategoriesController;
use App\Http\Controllers\Admin\ProductsController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ✅ Email OTP (public)
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/email/verify-otp', [AuthController::class, 'verifyEmailOtp']);
    Route::post('/email/resend-otp', [AuthController::class, 'resendEmailOtp']);
});

Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

// Reset Password (public)
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/verify-reset-otp', [AuthController::class, 'verifyResetOtp']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin Routes
    Route::get('/admin/users', [AdminController::class, 'index']);
    Route::post('/admin/create-user', [AdminController::class, 'createUser']);
    Route::put('/admin/users/{user}', [AdminController::class, 'update']);
    Route::patch('/admin/users/{user}/password', [AdminController::class, 'updatePassword']);
    Route::patch('/admin/users/{user}/status', [AdminController::class, 'changeStatus']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'destroy']);

    // Category Routes
    Route::get('/admin/categories', [CategoryController::class, 'index']);      // read (paginated + search)
    Route::post('/admin/categories', [CategoryController::class, 'store']);     // create
    Route::put('/admin/categories/{category}', [CategoryController::class, 'update']); // update
    Route::delete('/admin/categories/{category}', [CategoryController::class, 'destroy']); // delete

    // SUB CATEGORY ROUTES
    Route::get('/admin/sub-categories/category-options', [SubCategoriesController::class, 'categoryOptions']);
    Route::post('/admin/sub-categories/create', [SubCategoriesController::class, 'createSubCategory']);
    Route::get('/admin/sub-categories', [SubCategoriesController::class, 'viewSubCategory']);
    Route::put('/admin/sub-categories/{id}', [SubCategoriesController::class, 'updateSubCategory']);
    Route::delete('/admin/sub-categories/{id}', [SubCategoriesController::class, 'deleteSubCategory']);

    // PRODUCTS ROUTES
    Route::get('/admin/products/category-options', [ProductsController::class, 'categoryOptions']);
    Route::get('/admin/products/sub-category-options', [ProductsController::class, 'subCategoryOptions']);
    Route::post('/admin/products/create', [ProductsController::class, 'createProduct']);
    Route::get('/admin/products', [ProductsController::class, 'viewProducts']);
    Route::put('/admin/products/{id}', [ProductsController::class, 'updateProduct']);
    Route::delete('/admin/products/{id}', [ProductsController::class, 'deleteProduct']);
});


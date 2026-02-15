<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Auth\GoogleAuthController;

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
});
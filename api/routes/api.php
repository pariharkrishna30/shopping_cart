<?php

use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\StorefrontController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [PasswordResetController::class, 'requestReset']);
    Route::post('/reset-password', [PasswordResetController::class, 'reset']);
});

Route::get('/categories', [StorefrontController::class, 'categories']);
Route::get('/products', [StorefrontController::class, 'products']);
Route::get('/products/featured', [StorefrontController::class, 'featured']);
Route::get('/products/{product:slug}', [StorefrontController::class, 'show']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::post('/cart/sync', [CartController::class, 'sync']);
    Route::patch('/cart/{cartItem}', [CartController::class, 'update']);
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy']);

    Route::post('/checkout/payment-intent', [CheckoutController::class, 'createPaymentIntent']);
    Route::post('/checkout/confirm', [CheckoutController::class, 'confirm']);

    Route::get('/account/profile', [AccountController::class, 'profile']);
    Route::put('/account/profile', [AccountController::class, 'updateProfile']);
    Route::get('/account/orders', [AccountController::class, 'orders']);
    Route::get('/account/orders/{order}', [AccountController::class, 'showOrder']);
    Route::get('/account/orders/{order}/tracking', [AccountController::class, 'trackOrder']);

    Route::prefix('admin')->middleware('admin')->group(function (): void {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/categories', [AdminController::class, 'categories']);
        Route::post('/categories', [AdminController::class, 'storeCategory']);
        Route::post('/categories/{category}', [AdminController::class, 'updateCategory']);
        Route::delete('/categories/{category}', [AdminController::class, 'destroyCategory']);

        Route::get('/products', [AdminController::class, 'products']);
        Route::post('/products', [AdminController::class, 'storeProduct']);
        Route::post('/products/{product}', [AdminController::class, 'updateProduct']);
        Route::delete('/products/{product}', [AdminController::class, 'destroyProduct']);

        Route::get('/orders', [AdminController::class, 'orders']);
        Route::patch('/orders/{order}', [AdminController::class, 'updateOrder']);

        Route::get('/users', [AdminController::class, 'users']);
        Route::patch('/users/{user}/toggle-block', [AdminController::class, 'toggleUserBlock']);
    });
});

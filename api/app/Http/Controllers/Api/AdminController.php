<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function dashboard(): JsonResponse
    {
        return response()->json([
            'stats' => [
                'sales' => (float) Order::sum('total'),
                'orders' => Order::count(),
                'users' => User::count(),
                'products' => Product::count(),
            ],
            'recent_orders' => Order::with('user')->latest()->limit(5)->get(),
        ]);
    }

    public function categories(): JsonResponse
    {
        return response()->json([
            'categories' => Category::withCount('products')->orderBy('name')->get(),
        ]);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'image' => ['nullable', 'image', 'max:4096'],
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'image' => $request->file('image')?->store('categories', 'public'),
        ]);

        return response()->json(['category' => $category], 201);
    }

    public function updateCategory(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'image' => ['nullable', 'image', 'max:4096'],
        ]);

        $category->fill([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? $category->is_active,
        ]);

        if ($request->hasFile('image')) {
            $category->image = $request->file('image')->store('categories', 'public');
        }

        $category->save();

        return response()->json(['category' => $category]);
    }

    public function destroyCategory(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json(['message' => 'Category deleted.']);
    }

    public function products(): JsonResponse
    {
        return response()->json([
            'products' => Product::with(['category', 'images'])->latest()->get(),
        ]);
    }

    public function storeProduct(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:255', 'unique:products,sku'],
            'short_description' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'compare_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'review_count' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'images' => ['array'],
            'images.*' => ['image', 'max:4096'],
        ]);

        $product = DB::transaction(function () use ($request, $validated) {
            $product = Product::create([
                'category_id' => $validated['category_id'] ?? null,
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']),
                'sku' => $validated['sku'],
                'short_description' => $validated['short_description'] ?? null,
                'description' => $validated['description'] ?? null,
                'price' => $validated['price'],
                'compare_price' => $validated['compare_price'] ?? null,
                'stock' => $validated['stock'],
                'rating' => $validated['rating'] ?? 0,
                'review_count' => $validated['review_count'] ?? 0,
                'is_active' => $validated['is_active'] ?? true,
                'is_featured' => $validated['is_featured'] ?? false,
            ]);

            foreach ($request->file('images', []) as $index => $image) {
                $product->images()->create([
                    'path' => $image->store('products', 'public'),
                    'is_primary' => $index === 0,
                ]);
            }

            return $product->load(['category', 'images']);
        });

        return response()->json(['product' => $product], 201);
    }

    public function updateProduct(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:255', 'unique:products,sku,'.$product->id],
            'short_description' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'compare_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'review_count' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'images' => ['array'],
            'images.*' => ['image', 'max:4096'],
        ]);

        $product = DB::transaction(function () use ($request, $validated, $product) {
            $product->update([
                'category_id' => $validated['category_id'] ?? null,
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']),
                'sku' => $validated['sku'],
                'short_description' => $validated['short_description'] ?? null,
                'description' => $validated['description'] ?? null,
                'price' => $validated['price'],
                'compare_price' => $validated['compare_price'] ?? null,
                'stock' => $validated['stock'],
                'rating' => $validated['rating'] ?? $product->rating,
                'review_count' => $validated['review_count'] ?? $product->review_count,
                'is_active' => $validated['is_active'] ?? $product->is_active,
                'is_featured' => $validated['is_featured'] ?? $product->is_featured,
            ]);

            if ($request->hasFile('images')) {
                foreach ($product->images as $image) {
                    if ($image->path && ! str_starts_with($image->path, 'http')) {
                        Storage::disk('public')->delete($image->path);
                    }
                }

                $product->images()->delete();

                foreach ($request->file('images', []) as $index => $image) {
                    $product->images()->create([
                        'path' => $image->store('products', 'public'),
                        'is_primary' => $index === 0,
                    ]);
                }
            }

            return $product->load(['category', 'images']);
        });

        return response()->json(['product' => $product]);
    }

    public function destroyProduct(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted.']);
    }

    public function orders(): JsonResponse
    {
        return response()->json([
            'orders' => Order::with(['user', 'items'])->latest()->get(),
        ]);
    }

    public function updateOrder(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,processing,shipped,delivered,cancelled'],
            'tracking_number' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        $payload = [
            'status' => $validated['status'],
            'tracking_number' => $validated['tracking_number'] ?? $order->tracking_number,
            'notes' => $validated['notes'] ?? $order->notes,
        ];

        if ($validated['status'] === 'shipped' && ! $order->shipped_at) {
            $payload['shipped_at'] = now();
        }

        if ($validated['status'] === 'delivered' && ! $order->delivered_at) {
            $payload['delivered_at'] = now();
        }

        $order->update($payload);

        return response()->json(['order' => $order->fresh('items', 'user')]);
    }

    public function users(): JsonResponse
    {
        return response()->json([
            'users' => User::latest()->get(),
        ]);
    }

    public function toggleUserBlock(User $user): JsonResponse
    {
        if ($user->isAdmin()) {
            return response()->json(['message' => 'Admin users cannot be blocked.'], 422);
        }

        $user->update(['is_blocked' => ! $user->is_blocked]);

        return response()->json([
            'message' => $user->is_blocked ? 'User blocked.' : 'User unblocked.',
            'user' => $user,
        ]);
    }
}

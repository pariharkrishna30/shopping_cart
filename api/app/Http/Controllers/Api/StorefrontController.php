<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StorefrontController extends Controller
{
    public function categories(): JsonResponse
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->withCount('products')
            ->orderBy('name')
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'image' => $this->imageUrl($category->image),
                'products_count' => $category->products_count,
            ]);

        return response()->json(['categories' => $categories]);
    }

    public function products(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => ['nullable', 'string', 'max:120'],
            'search' => ['nullable', 'string', 'max:120'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:48'],
        ]);

        $query = Product::query()
            ->with(['category', 'images'])
            ->where('is_active', true);

        if (! empty($validated['category'])) {
            $query->whereHas('category', fn ($builder) => $builder->where('slug', $validated['category']));
        }

        if (! empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        $products = $query
            ->orderByDesc('is_featured')
            ->orderByDesc('created_at')
            ->paginate($validated['per_page'] ?? 12)
            ->through(fn (Product $product) => $this->transformProduct($product));

        return response()->json($products);
    }

    public function featured(): JsonResponse
    {
        $products = Product::query()
            ->with(['category', 'images'])
            ->where('is_active', true)
            ->where('is_featured', true)
            ->limit(4)
            ->get()
            ->map(fn (Product $product) => $this->transformProduct($product));

        return response()->json(['products' => $products]);
    }

    public function show(Product $product): JsonResponse
    {
        $product->load(['category', 'images']);

        abort_unless($product->is_active, 404);

        return response()->json([
            'product' => $this->transformProduct($product, true),
        ]);
    }

    private function transformProduct(Product $product, bool $withDescription = false): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'sku' => $product->sku,
            'price' => (float) $product->price,
            'compare_price' => $product->compare_price ? (float) $product->compare_price : null,
            'stock' => $product->stock,
            'rating' => (float) $product->rating,
            'review_count' => $product->review_count,
            'short_description' => $product->short_description,
            'description' => $withDescription ? $product->description : null,
            'category' => $product->category ? [
                'id' => $product->category->id,
                'name' => $product->category->name,
                'slug' => $product->category->slug,
            ] : null,
            'images' => $product->images->map(fn ($image) => [
                'id' => $image->id,
                'url' => $this->imageUrl($image->path),
                'is_primary' => $image->is_primary,
            ])->values(),
            'is_featured' => $product->is_featured,
        ];
    }

    private function imageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return rtrim(request()->getSchemeAndHttpHost(), '/').'/storage/'.$path;
    }
}

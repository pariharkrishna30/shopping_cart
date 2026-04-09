<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = $request->user()->cartItems()->with('product.images', 'product.category')->get();

        return response()->json($this->cartPayload($items));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($validated['product_id']);
        abort_unless($product->is_active, 422, 'Product is unavailable.');

        $item = CartItem::firstOrNew([
            'user_id' => $request->user()->id,
            'product_id' => $product->id,
        ]);

        $item->quantity = min(($item->quantity ?? 0) + $validated['quantity'], $product->stock);
        $item->save();

        return response()->json([
            'message' => 'Cart updated.',
            ...$this->cartPayload($request->user()->cartItems()->with('product.images', 'product.category')->get()),
        ]);
    }

    public function sync(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['array'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        foreach ($validated['items'] ?? [] as $itemData) {
            $product = Product::find($itemData['product_id']);

            if (! $product || ! $product->is_active) {
                continue;
            }

            CartItem::updateOrCreate(
                [
                    'user_id' => $request->user()->id,
                    'product_id' => $product->id,
                ],
                [
                    'quantity' => min($itemData['quantity'], $product->stock),
                ]
            );
        }

        return response()->json($this->cartPayload($request->user()->cartItems()->with('product.images', 'product.category')->get()));
    }

    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        abort_unless($cartItem->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cartItem->quantity = min($validated['quantity'], $cartItem->product->stock);
        $cartItem->save();

        return response()->json([
            'message' => 'Cart item updated.',
            ...$this->cartPayload($request->user()->cartItems()->with('product.images', 'product.category')->get()),
        ]);
    }

    public function destroy(Request $request, CartItem $cartItem): JsonResponse
    {
        abort_unless($cartItem->user_id === $request->user()->id, 403);

        $cartItem->delete();

        return response()->json([
            'message' => 'Item removed from cart.',
            ...$this->cartPayload($request->user()->cartItems()->with('product.images', 'product.category')->get()),
        ]);
    }

    private function cartPayload($items): array
    {
        $formatted = $items->map(function (CartItem $item) {
            $product = $item->product;
            $primaryImage = $product->images->firstWhere('is_primary', true) ?? $product->images->first();

            return [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'product' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => (float) $product->price,
                    'stock' => $product->stock,
                    'category' => $product->category?->name,
                    'image' => $this->imageUrl($primaryImage?->path),
                ],
                'line_total' => round($item->quantity * (float) $product->price, 2),
            ];
        })->values();

        return [
            'items' => $formatted,
            'summary' => [
                'subtotal' => round($formatted->sum('line_total'), 2),
                'count' => $formatted->sum('quantity'),
            ],
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

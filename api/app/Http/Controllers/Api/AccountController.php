<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'profile' => [
                'user' => $request->user(),
                'default_address' => $request->user()->addresses()->where('is_default', true)->first(),
            ],
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        $request->user()->update($validated);

        return response()->json([
            'message' => 'Profile updated.',
            'user' => $request->user()->fresh(),
        ]);
    }

    public function orders(Request $request): JsonResponse
    {
        $orders = $request->user()->orders()->with('items')->latest()->get();

        return response()->json(['orders' => $orders]);
    }

    public function showOrder(Request $request, Order $order): JsonResponse
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        return response()->json([
            'order' => $order->load('items'),
        ]);
    }

    public function trackOrder(Request $request, Order $order): JsonResponse
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        return response()->json([
            'tracking' => [
                'order_number' => $order->order_number,
                'status' => $order->status,
                'tracking_number' => $order->tracking_number,
                'placed_at' => $order->created_at,
                'shipped_at' => $order->shipped_at,
                'delivered_at' => $order->delivered_at,
            ],
        ]);
    }
}

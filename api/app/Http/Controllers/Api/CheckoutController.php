<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Stripe\Exception\ApiErrorException;
use Stripe\StripeClient;

class CheckoutController extends Controller
{
    public function createPaymentIntent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'shipping_address.full_name' => ['required', 'string', 'max:255'],
            'shipping_address.phone' => ['required', 'string', 'max:30'],
            'shipping_address.line1' => ['required', 'string', 'max:255'],
            'shipping_address.line2' => ['nullable', 'string', 'max:255'],
            'shipping_address.city' => ['required', 'string', 'max:255'],
            'shipping_address.state' => ['required', 'string', 'max:255'],
            'shipping_address.postal_code' => ['required', 'string', 'max:30'],
            'shipping_address.country' => ['required', 'string', 'max:255'],
        ]);

        [$items, $totals] = $this->cartContext($request);

        abort_if($items->isEmpty(), 422, 'Your cart is empty.');

        $stripe = $this->stripe();

        try {
            $intent = $stripe->paymentIntents->create([
                'amount' => (int) round($totals['total'] * 100),
                'currency' => config('services.stripe.currency', 'usd'),
                'automatic_payment_methods' => ['enabled' => true],
                'metadata' => [
                    'user_id' => (string) $request->user()->id,
                    'cart_items' => (string) $items->count(),
                ],
            ]);
        } catch (ApiErrorException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json([
            'client_secret' => $intent->client_secret,
            'payment_intent_id' => $intent->id,
            'totals' => $totals,
            'shipping_address' => $validated['shipping_address'],
        ]);
    }

    public function confirm(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payment_intent_id' => ['required', 'string'],
            'shipping_address.full_name' => ['required', 'string', 'max:255'],
            'shipping_address.phone' => ['required', 'string', 'max:30'],
            'shipping_address.line1' => ['required', 'string', 'max:255'],
            'shipping_address.line2' => ['nullable', 'string', 'max:255'],
            'shipping_address.city' => ['required', 'string', 'max:255'],
            'shipping_address.state' => ['required', 'string', 'max:255'],
            'shipping_address.postal_code' => ['required', 'string', 'max:30'],
            'shipping_address.country' => ['required', 'string', 'max:255'],
        ]);

        [$items, $totals] = $this->cartContext($request);
        abort_if($items->isEmpty(), 422, 'Your cart is empty.');

        try {
            $intent = $this->stripe()->paymentIntents->retrieve($validated['payment_intent_id'], []);
        } catch (ApiErrorException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        if ($intent->status !== 'succeeded' && $intent->status !== 'requires_capture') {
            return response()->json(['message' => 'Payment has not been completed.'], 422);
        }

        $order = DB::transaction(function () use ($request, $validated, $items, $totals, $intent) {
            $user = $request->user();

            Address::updateOrCreate(
                ['user_id' => $user->id, 'type' => 'shipping', 'is_default' => true],
                $validated['shipping_address'] + ['type' => 'shipping', 'is_default' => true]
            );

            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-'.strtoupper(Str::random(8)),
                'status' => 'pending',
                'payment_status' => 'paid',
                'subtotal' => $totals['subtotal'],
                'tax' => $totals['tax'],
                'shipping_amount' => $totals['shipping'],
                'total' => $totals['total'],
                'shipping_address' => $validated['shipping_address'],
                'stripe_payment_intent_id' => $intent->id,
                'paid_at' => now(),
            ]);

            foreach ($items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_sku' => $item->product->sku,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                    'total' => $item->quantity * $item->product->price,
                ]);

                $item->product->decrement('stock', $item->quantity);
            }

            $user->cartItems()->delete();

            return $order->load('items');
        });

        return response()->json([
            'message' => 'Order placed successfully.',
            'order' => $order,
        ], 201);
    }

    private function cartContext(Request $request): array
    {
        $items = $request->user()->cartItems()->with('product')->get();
        $subtotal = round($items->sum(fn ($item) => $item->quantity * (float) $item->product->price), 2);
        $shipping = $subtotal > 0 ? 15.0 : 0.0;
        $tax = round($subtotal * 0.1, 2);

        return [$items, [
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'tax' => $tax,
            'total' => round($subtotal + $shipping + $tax, 2),
        ]];
    }

    private function stripe(): StripeClient
    {
        return new StripeClient(config('services.stripe.secret'));
    }
}

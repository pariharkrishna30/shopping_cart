import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const patchQuantity = (items, productId, quantity) =>
  items
    .map((item) =>
      item.product.id === productId ? { ...item, quantity, line_total: quantity * item.product.price } : item,
    )
    .filter((item) => item.quantity > 0)

export const summarizeCart = (items) => ({
  subtotal: Number(items.reduce((sum, item) => sum + item.line_total, 0).toFixed(2)),
  count: items.reduce((sum, item) => sum + item.quantity, 0),
})

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id)

          const items = existing
            ? patchQuantity(state.items, product.id, existing.quantity + quantity)
            : state.items.concat({
                id: `guest-${product.id}`,
                quantity,
                line_total: product.price * quantity,
                product: {
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  stock: product.stock,
                  category: product.category?.name || product.category,
                  image: product.images?.[0]?.url || product.image || null,
                },
              })

          return { items }
        }),
      updateItem: (productId, quantity) =>
        set((state) => ({
          items: patchQuantity(state.items, productId, quantity),
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'eshopping-cart',
    },
  ),
)

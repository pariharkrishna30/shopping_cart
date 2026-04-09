import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api, getMessage } from '../lib/api'
import { money } from '../lib/format'
import { Panel, SectionHeader } from '../components/UI'
import { useAuthStore } from '../store/auth'
import { summarizeCart, useCartStore } from '../store/cart'
import { useToastStore } from '../store/toast'

export function CartPage() {
  const token = useAuthStore((state) => state.token)
  const guestItems = useCartStore((state) => state.items)
  const updateGuest = useCartStore((state) => state.updateItem)
  const removeGuest = useCartStore((state) => state.removeItem)
  const showToast = useToastStore((state) => state.showToast)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const cartQuery = useQuery({
    queryKey: ['cart'],
    enabled: Boolean(token),
    queryFn: async () => (await api.get('/cart')).data,
  })

  const updateItem = useMutation({
    mutationFn: async ({ id, quantity }) => api.patch(`/cart/${id}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      showToast({
        type: 'success',
        title: 'Cart updated',
        message: 'Quantity changed successfully.',
      })
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Update failed',
        message: getMessage(error, 'Could not update cart item.'),
      })
    },
  })

  const removeItem = useMutation({
    mutationFn: async (id) => api.delete(`/cart/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      showToast({
        type: 'success',
        title: 'Item removed',
        message: 'The product was removed from your cart.',
      })
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Remove failed',
        message: getMessage(error, 'Could not remove this item.'),
      })
    },
  })

  const items = token ? cartQuery.data?.items || [] : guestItems
  const summary = token ? cartQuery.data?.summary || { subtotal: 0, count: 0 } : summarizeCart(guestItems)

  return (
    <section className="section-block">
      <SectionHeader title="Cart" subtitle="Persistent guest cart locally and synced cart storage for authenticated users." />
      <div className="cart-layout">
        <div className="stack">
          {items.length === 0 && <Panel>Your cart is empty.</Panel>}
          {items.map((item) => (
            <article className="cart-item" key={item.id}>
              <img alt={item.product.name} src={item.product.image} />
              <div className="cart-item-meta">
                <strong>{item.product.name}</strong>
                <span>{item.product.category}</span>
                <span>{money(item.product.price)}</span>
              </div>
              <div className="cart-item-actions">
                <input
                  className="quantity-input"
                  min="1"
                  type="number"
                  value={item.quantity}
                  onChange={(event) => {
                    const quantity = Number(event.target.value)
                    if (token) updateItem.mutate({ id: item.id, quantity })
                    else {
                      updateGuest(item.product.id, quantity)
                      showToast({
                        type: 'success',
                        title: 'Cart updated',
                        message: 'Guest cart quantity changed successfully.',
                      })
                    }
                  }}
                />
                <button
                  className="ghost-button"
                  onClick={() => {
                    if (token) {
                      removeItem.mutate(item.id)
                    } else {
                      removeGuest(item.product.id)
                      showToast({
                        type: 'success',
                        title: 'Item removed',
                        message: 'The product was removed from your guest cart.',
                      })
                    }
                  }}
                  type="button"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
        <Panel className="summary-panel">
          <h3>Order summary</h3>
          <div className="summary-row"><span>Items</span><strong>{summary.count}</strong></div>
          <div className="summary-row"><span>Subtotal</span><strong>{money(summary.subtotal)}</strong></div>
          <button
            className="primary-button"
            disabled={items.length === 0}
            onClick={() => navigate(token ? '/checkout' : '/login')}
            type="button"
          >
            {token ? 'Proceed to checkout' : 'Login to checkout'}
          </button>
        </Panel>
      </div>
    </section>
  )
}

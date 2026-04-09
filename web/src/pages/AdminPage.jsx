import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Package, Shield, ShoppingBag, Truck, UserRound } from 'lucide-react'
import { api, getMessage } from '../lib/api'
import { money, statusClass } from '../lib/format'
import { Field, Panel, SectionHeader, Stat } from '../components/UI'
import { useToastStore } from '../store/toast'

export function AdminPage() {
  const [productDraft, setProductDraft] = useState({})
  const [categoryDraft, setCategoryDraft] = useState({})
  const showToast = useToastStore((state) => state.showToast)
  const queryClient = useQueryClient()

  const dashboard = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => (await api.get('/admin/dashboard')).data,
  })
  const categories = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => (await api.get('/admin/categories')).data.categories,
  })
  const products = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => (await api.get('/admin/products')).data.products,
  })
  const orders = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => (await api.get('/admin/orders')).data.orders,
  })
  const users = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get('/admin/users')).data.users,
  })

  const saveCategory = useMutation({
    mutationFn: async (formData) =>
      categoryDraft.id
        ? (await api.post(`/admin/categories/${categoryDraft.id}`, formData)).data
        : (await api.post('/admin/categories', formData)).data,
    onSuccess: () => {
      setCategoryDraft({})
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      showToast({
        type: 'success',
        title: 'Category saved',
        message: 'The category changes were saved successfully.',
      })
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Category save failed',
        message: getMessage(error, 'Could not save category.'),
      })
    },
  })

  const saveProduct = useMutation({
    mutationFn: async (formData) =>
      productDraft.id
        ? (await api.post(`/admin/products/${productDraft.id}`, formData)).data
        : (await api.post('/admin/products', formData)).data,
    onSuccess: () => {
      setProductDraft({})
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      showToast({
        type: 'success',
        title: 'Product saved',
        message: 'The product changes were saved successfully.',
      })
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Product save failed',
        message: getMessage(error, 'Could not save product.'),
      })
    },
  })

  const updateOrder = useMutation({
    mutationFn: async ({ id, status }) => (await api.patch(`/admin/orders/${id}`, { status })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      showToast({
        type: 'success',
        title: 'Order updated',
        message: 'Order status changed successfully.',
      })
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Order update failed',
        message: getMessage(error, 'Could not update order status.'),
      })
    },
  })

  const toggleBlock = useMutation({
    mutationFn: async (id) => (await api.patch(`/admin/users/${id}/toggle-block`)).data,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      showToast({
        type: 'success',
        title: 'User updated',
        message: data.message,
      })
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'User update failed',
        message: getMessage(error, 'Could not change user status.'),
      })
    },
  })

  return (
    <section className="section-block">
      <div className="admin-hero">
        <SectionHeader title="Admin panel" subtitle="Sales overview, inventory controls, order updates, and access management." />
        <div className="admin-hero-note">Manage inventory, fulfillment, and customer access from one surface.</div>
      </div>
      <div className="grid stat-grid">
        <Stat label="Sales" value={money(dashboard.data?.stats?.sales || 0)} icon={<ShoppingBag size={18} />} />
        <Stat label="Orders" value={dashboard.data?.stats?.orders || 0} icon={<Truck size={18} />} />
        <Stat label="Users" value={dashboard.data?.stats?.users || 0} icon={<UserRound size={18} />} />
        <Stat label="Products" value={dashboard.data?.stats?.products || 0} icon={<Shield size={18} />} />
      </div>

      <div className="admin-grid">
        <Panel>
          <SectionHeader title="Categories" subtitle="Add, edit, and delete categories." />
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault()
              const formData = new FormData(event.currentTarget)
              saveCategory.mutate(formData)
            }}
          >
            <Field label="Name" value={categoryDraft.name || ''} onChange={(event) => setCategoryDraft((state) => ({ ...state, name: event.target.value }))} />
            <Field label="Description" value={categoryDraft.description || ''} onChange={(event) => setCategoryDraft((state) => ({ ...state, description: event.target.value }))} />
            <label className="field field-span-2">
              <span>Image</span>
              <input name="image" type="file" />
            </label>
            <input name="name" type="hidden" value={categoryDraft.name || ''} />
            <input name="description" type="hidden" value={categoryDraft.description || ''} />
            <button className="primary-button" type="submit">{categoryDraft.id ? 'Update category' : 'Add category'}</button>
          </form>
          <div className="stack">
            {categories.data?.map((item) => (
              <article className="list-row" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.products_count} products</p>
                </div>
                <div className="row-actions">
                  <button className="ghost-button" onClick={() => setCategoryDraft(item)} type="button">Edit</button>
                  <button
                    className="ghost-button"
                    onClick={async () => {
                      try {
                        await api.delete(`/admin/categories/${item.id}`)
                        categories.refetch()
                        showToast({
                          type: 'success',
                          title: 'Category deleted',
                          message: `${item.name} was removed successfully.`,
                        })
                      } catch (error) {
                        showToast({
                          type: 'error',
                          title: 'Delete failed',
                          message: getMessage(error, 'Could not delete category.'),
                        })
                      }
                    }}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionHeader title="Products" subtitle="Inventory, pricing, and image uploads." />
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault()
              const formData = new FormData(event.currentTarget)
              saveProduct.mutate(formData)
            }}
          >
            <Field label="Name" value={productDraft.name || ''} onChange={(event) => setProductDraft((state) => ({ ...state, name: event.target.value }))} />
            <Field label="SKU" value={productDraft.sku || ''} onChange={(event) => setProductDraft((state) => ({ ...state, sku: event.target.value }))} />
            <Field label="Price" type="number" value={productDraft.price || ''} onChange={(event) => setProductDraft((state) => ({ ...state, price: event.target.value }))} />
            <Field label="Stock" type="number" value={productDraft.stock || ''} onChange={(event) => setProductDraft((state) => ({ ...state, stock: event.target.value }))} />
            <label className="field field-span-2">
              <span>Category</span>
              <select value={productDraft.category_id || ''} onChange={(event) => setProductDraft((state) => ({ ...state, category_id: event.target.value }))}>
                <option value="">Select category</option>
                {categories.data?.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="field field-span-2">
              <span>Short description</span>
              <textarea value={productDraft.short_description || ''} onChange={(event) => setProductDraft((state) => ({ ...state, short_description: event.target.value }))} />
            </label>
            <label className="field field-span-2">
              <span>Description</span>
              <textarea value={productDraft.description || ''} onChange={(event) => setProductDraft((state) => ({ ...state, description: event.target.value }))} />
            </label>
            <label className="field field-span-2">
              <span>Images</span>
              <input multiple name="images[]" type="file" />
            </label>
            <input name="name" type="hidden" value={productDraft.name || ''} />
            <input name="sku" type="hidden" value={productDraft.sku || ''} />
            <input name="price" type="hidden" value={productDraft.price || ''} />
            <input name="stock" type="hidden" value={productDraft.stock || ''} />
            <input name="category_id" type="hidden" value={productDraft.category_id || ''} />
            <input name="short_description" type="hidden" value={productDraft.short_description || ''} />
            <input name="description" type="hidden" value={productDraft.description || ''} />
            <button className="primary-button" type="submit">{productDraft.id ? 'Update product' : 'Add product'}</button>
          </form>
          <div className="stack">
            {products.data?.map((item) => (
              <article className="list-row" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p>{money(item.price)} · stock {item.stock}</p>
                </div>
                <div className="row-actions">
                  <button className="ghost-button" onClick={() => setProductDraft(item)} type="button">Edit</button>
                  <button
                    className="ghost-button"
                    onClick={async () => {
                      try {
                        await api.delete(`/admin/products/${item.id}`)
                        products.refetch()
                        showToast({
                          type: 'success',
                          title: 'Product deleted',
                          message: `${item.name} was removed successfully.`,
                        })
                      } catch (error) {
                        showToast({
                          type: 'error',
                          title: 'Delete failed',
                          message: getMessage(error, 'Could not delete product.'),
                        })
                      }
                    }}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionHeader title="Orders" subtitle="Update pending, shipped, or delivered states." />
          <div className="stack">
            {orders.data?.map((order) => (
              <article className="list-row" key={order.id}>
                <div>
                  <strong>{order.order_number}</strong>
                  <p>{order.user?.name || 'Customer'} · {money(order.total)}</p>
                </div>
                <div className="row-actions">
                  <select defaultValue={order.status} onChange={(event) => updateOrder.mutate({ id: order.id, status: event.target.value })}>
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionHeader title="Users" subtitle="Block or unblock customer accounts." />
          <div className="stack">
            {users.data?.map((item) => (
              <article className="list-row" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.email}</p>
                </div>
                <div className="row-actions">
                  <span className={statusClass(item.is_blocked ? 'cancelled' : 'delivered')}>
                    {item.is_blocked ? 'blocked' : item.role}
                  </span>
                  {item.role !== 'admin' && (
                    <button className="ghost-button" onClick={() => toggleBlock.mutate(item.id)} type="button">
                      {item.is_blocked ? 'Unblock' : 'Block'}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  )
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { NavLink, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { getMessage } from '../lib/api'
import { money } from '../lib/format'
import { Panel, ProductCard } from '../components/UI'
import { useAuthStore } from '../store/auth'
import { useCartStore } from '../store/cart'
import { useToastStore } from '../store/toast'

export function ProductPage() {
  const { slug } = useParams()
  const token = useAuthStore((state) => state.token)
  const addGuestItem = useCartStore((state) => state.addItem)
  const showToast = useToastStore((state) => state.showToast)
  const queryClient = useQueryClient()

  const productQuery = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => (await api.get(`/products/${slug}`)).data.product,
  })

  const relatedQuery = useQuery({
    queryKey: ['related-products', slug, productQuery.data?.category?.slug],
    enabled: Boolean(productQuery.data?.category?.slug),
    queryFn: async () =>
      (
        await api.get('/products', {
          params: {
            category: productQuery.data.category.slug,
            per_page: 4,
          },
        })
      ).data,
  })

  const addToCart = useMutation({
    mutationFn: async () => {
      if (token) {
        await api.post('/cart', { product_id: productQuery.data.id, quantity: 1 })
      } else {
        addGuestItem(productQuery.data, 1)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      showToast({
        type: 'success',
        title: 'Added to cart',
        message: `${productQuery.data.name} was added successfully.`,
      })
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Could not add item',
        message: getMessage(error, 'Please try again.'),
      })
    },
  })

  if (productQuery.isLoading) {
    return <Panel>Loading product...</Panel>
  }

  const product = productQuery.data

  return (
    <>
      <section className="product-detail">
        <div className="product-gallery">
          <img alt={product.name} decoding="async" src={product.images?.[0]?.url} />
        </div>
        <div className="product-meta">
          <span className="eyebrow">{product.category?.name}</span>
          <h2>{product.name}</h2>
          <p className="muted">{product.description}</p>
          <div className="price-row">
            <strong>{money(product.price)}</strong>
            {product.compare_price && <span>{money(product.compare_price)}</span>}
          </div>
          <div className="details-strip">
            <span>SKU {product.sku}</span>
            <span>Stock {product.stock}</span>
            <span>{product.rating} / 5</span>
          </div>
          <button className="primary-button" onClick={() => addToCart.mutate()} type="button">
            Add to cart
          </button>
          <NavLink className="ghost-button" to="/products">
            Back to catalog
          </NavLink>
        </div>
        <div className="panel product-aside">
          <SectionSummary product={product} />
        </div>
      </section>
      {relatedQuery.data?.data?.length > 0 && (
        <section className="section-block">
          <div className="related-grid">
            {relatedQuery.data.data
              .filter((item) => item.slug !== product.slug)
              .slice(0, 3)
              .map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
          </div>
        </section>
      )}
    </>
  )
}

function SectionSummary({ product }) {
  return (
    <>
      <span className="eyebrow">Why it stands out</span>
      <h3>Designed for usable luxury</h3>
      <p className="muted">
        {product.short_description} Every item in this catalog is rendered from database content, not
        hardcoded UI copy, so category, imagery, and pricing stay aligned with the backend.
      </p>
    </>
  )
}

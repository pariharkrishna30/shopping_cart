import { startTransition, useDeferredValue, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LayoutDashboard, Package, Search, Truck } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { api } from '../lib/api'
import { ProductCard, SectionHeader, Stat } from '../components/UI'

export function HomePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const deferredSearch = useDeferredValue(search)

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data.categories,
  })

  const featuredQuery = useQuery({
    queryKey: ['featured'],
    queryFn: async () => (await api.get('/products/featured')).data.products,
  })

  const productsQuery = useQuery({
    queryKey: ['products', category, deferredSearch],
    queryFn: async () =>
      (
        await api.get('/products', {
          params: {
            category: category || undefined,
            search: deferredSearch || undefined,
          },
        })
      ).data,
  })

  return (
    <>
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Modern catalog experience</span>
          <h1>Distinctive commerce for beautifully overstocked shelves.</h1>
          <p>
            A stylish storefront backed by Laravel and MySQL, seeded with a deep catalog, modern
            gradients, responsive layouts, and database-driven product content from day one.
          </p>
          <div className="hero-actions">
            <NavLink className="primary-button" to="/products">
              Browse all products
            </NavLink>
            <span className="hero-chip">100+ products seeded automatically</span>
          </div>
        </div>
        <div className="hero-stats">
          <Stat label="Categories" value={categoriesQuery.data?.length || 0} icon={<LayoutDashboard size={18} />} />
          <Stat label="Featured" value={featuredQuery.data?.length || 0} icon={<Package size={18} />} />
          <Stat label="Responsive" value="100%" icon={<Truck size={18} />} />
        </div>
      </section>

      <section className="showcase-strip">
        {categoriesQuery.data?.slice(0, 3).map((item) => (
          <article className="showcase-card" key={item.id}>
            <img alt={item.name} loading="lazy" src={item.image} />
            <div className="showcase-copy">
              <span className="eyebrow">{item.products_count} products</span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="filters-panel">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search by name, SKU, or description"
            value={search}
            onChange={(event) => startTransition(() => setSearch(event.target.value))}
          />
        </div>
        <div className="chip-row">
          <button className={!category ? 'chip active' : 'chip'} onClick={() => setCategory('')} type="button">
            All products
          </button>
          {categoriesQuery.data?.map((item) => (
            <button
              key={item.id}
              className={category === item.slug ? 'chip active' : 'chip'}
              onClick={() => startTransition(() => setCategory(item.slug))}
              type="button"
            >
              {item.name}
            </button>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title="Featured picks" subtitle="Editorial curation for the landing page and promotions." />
        <div className="grid products-grid">
          {featuredQuery.data?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title="Catalog" subtitle="Category filtering, free-text search, and mobile-friendly product browsing." />
        <div className="results-bar">
          <span className="muted">
            {productsQuery.data?.total || 0} product{productsQuery.data?.total === 1 ? '' : 's'}
            {category ? ` in ${categoriesQuery.data?.find((item) => item.slug === category)?.name || category}` : ''}
            {search ? ` matching "${search}"` : ''}
          </span>
        </div>
        <div className="grid products-grid">
          {productsQuery.data?.data?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {productsQuery.data?.data?.length === 0 && (
          <div className="empty-state">
            <h3>No products match this search.</h3>
            <p>Clear the search or change the category filter to see more items.</p>
          </div>
        )}
        <div className="catalog-footer">
          <NavLink className="inline-action" to="/products">
            View full catalog
          </NavLink>
        </div>
      </section>
    </>
  )
}

import { startTransition, useDeferredValue, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { NavLink, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import { ProductCard, SectionHeader } from '../components/UI'

export function ProductListingPage() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('search') || '')
  const deferredSearch = useDeferredValue(search)
  const page = Number(params.get('page') || 1)
  const category = params.get('category') || ''

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data.categories,
  })

  const productsQuery = useQuery({
    queryKey: ['catalog', page, category, deferredSearch],
    queryFn: async () =>
      (
        await api.get('/products', {
          params: {
            page,
            category: category || undefined,
            search: deferredSearch || undefined,
            per_page: 24,
          },
        })
      ).data,
  })

  const updateParams = (next) => {
    const merged = {
      page: '1',
      ...(category ? { category } : {}),
      ...(search ? { search } : {}),
      ...next,
    }

    Object.keys(merged).forEach((key) => {
      if (!merged[key]) delete merged[key]
    })

    setParams(merged)
  }

  return (
    <section className="section-block">
      <div className="catalog-header">
        <SectionHeader
          title="All products"
          subtitle="Database-loaded catalog with filter chips, free-text search, lazy images, and server pagination."
        />
        <NavLink className="inline-action" to="/">
          Back home
        </NavLink>
      </div>

      <section className="filters-panel">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search products"
            value={search}
            onChange={(event) => {
              const value = event.target.value
              startTransition(() => setSearch(value))
              updateParams({ search: value })
            }}
          />
        </div>
        <div className="chip-row">
          <button className={!category ? 'chip active' : 'chip'} onClick={() => updateParams({ category: '' })} type="button">
            All
          </button>
          {categoriesQuery.data?.map((item) => (
            <button
              key={item.id}
              className={category === item.slug ? 'chip active' : 'chip'}
              onClick={() => updateParams({ category: item.slug })}
              type="button"
            >
              {item.name}
            </button>
          ))}
        </div>
      </section>

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
          <h3>No products match this filter.</h3>
          <p>Try a different search term or switch back to all categories.</p>
        </div>
      )}

      <div className="pagination-row">
        <button
          className="ghost-button"
          disabled={!productsQuery.data?.prev_page_url}
          onClick={() => updateParams({ page: String(Math.max(1, page - 1)) })}
          type="button"
        >
          Previous
        </button>
        <span className="muted">
          Page {productsQuery.data?.current_page || 1} of {productsQuery.data?.last_page || 1}
        </span>
        <button
          className="ghost-button"
          disabled={!productsQuery.data?.next_page_url}
          onClick={() => updateParams({ page: String(page + 1) })}
          type="button"
        >
          Next
        </button>
      </div>
    </section>
  )
}

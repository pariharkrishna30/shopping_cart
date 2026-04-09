import { NavLink, Navigate, useLocation } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { money } from '../lib/format'

export function Panel({ children, className = '' }) {
  return <div className={`panel ${className}`.trim()}>{children}</div>
}

export function SectionHeader({ title, subtitle }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  )
}

export function Stat({ label, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export function Field({ label, register, className = '', ...props }) {
  return (
    <label className={`field ${className}`.trim()}>
      <span>{label}</span>
      <input {...register} {...props} />
    </label>
  )
}

export function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-card-media">
        <img alt={product.name} decoding="async" loading="lazy" src={product.images?.[0]?.url} />
        <div className="product-card-pill">{product.category?.name}</div>
      </div>
      <div className="product-card-body">
        <h3>{product.name}</h3>
        <p>{product.short_description}</p>
        <div className="card-footer">
          <div className="price-stack">
            <strong>{money(product.price)}</strong>
            <span>Curated pick</span>
          </div>
          <NavLink className="inline-action" to={`/products/${product.slug}`}>
            Explore <ArrowRight size={16} />
          </NavLink>
        </div>
      </div>
    </article>
  )
}

export function ProtectedRoute({ children, authLoading = false }) {
  const token = useAuthStore((state) => state.token)
  const location = useLocation()

  if (authLoading) {
    return <div className="route-loading">Loading your account...</div>
  }

  if (!token) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return children
}

export function AdminRoute({ children, authLoading = false }) {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)

  if (authLoading) {
    return <div className="route-loading">Loading admin access...</div>
  }

  if (!token) {
    return <Navigate replace to="/login" />
  }

  if (!user) {
    return <div className="route-loading">Loading admin access...</div>
  }

  if (user.role !== 'admin') {
    return <Navigate replace to="/" />
  }

  return children
}

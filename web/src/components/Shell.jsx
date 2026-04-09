import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { summarizeCart, useCartStore } from '../store/cart'
import { useAuthStore } from '../store/auth'
import { BrandLogo } from './BrandLogo'

export function Shell() {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const guestItems = useCartStore((state) => state.items)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const cartQuery = useQuery({
    queryKey: ['cart'],
    enabled: Boolean(token),
    queryFn: async () => (await api.get('/cart')).data,
  })

  const logout = useMutation({
    mutationFn: async () => api.post('/auth/logout'),
    onSettled: () => {
      clearAuth()
      queryClient.clear()
      navigate('/')
    },
  })

  const cartCount = token ? cartQuery.data?.summary?.count || 0 : summarizeCart(guestItems).count

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/">
          <BrandLogo />
          <div className="brand-copy">
            <strong>eshopping</strong>
            <span>Refined commerce for modern essentials</span>
          </div>
        </NavLink>
        <nav className="topnav">
          <NavLink to="/">Shop</NavLink>
          <NavLink to="/products">Catalog</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
          {token ? <NavLink to="/account">Account</NavLink> : <NavLink to="/login">Login</NavLink>}
          <NavLink className="cart-link" to="/cart">
            Cart
            <span>{cartCount}</span>
          </NavLink>
          {token && (
            <button className="ghost-button" onClick={() => logout.mutate()} type="button">
              Logout
            </button>
          )}
        </nav>
      </header>
      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  )
}

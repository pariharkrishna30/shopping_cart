import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './lib/api'
import { useAuthStore } from './store/auth'
import { useCartStore } from './store/cart'
import { Shell } from './components/Shell'
import { ProtectedRoute, AdminRoute } from './components/UI'
import { HomePage } from './pages/HomePage'
import { ProductListingPage } from './pages/ProductListingPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { AccountPage } from './pages/AccountPage'
import { AdminPage } from './pages/AdminPage'
import { AuthPage } from './pages/AuthPage'
import { ToastContainer } from './components/ToastContainer'

function App() {
  const queryClient = useQueryClient()
  const token = useAuthStore((state) => state.token)
  const setUser = useAuthStore((state) => state.setUser)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const user = useAuthStore((state) => state.user)
  const guestItems = useCartStore((state) => state.items)
  const clearGuestCart = useCartStore((state) => state.clearCart)

  const meQuery = useQuery({
    queryKey: ['me', token],
    enabled: Boolean(token),
    queryFn: async () => (await api.get('/auth/me')).data.user,
  })

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data)
    }
  }, [meQuery.data, setUser])

  useEffect(() => {
    if (meQuery.isError) {
      clearAuth()
    }
  }, [clearAuth, meQuery.isError])

  useEffect(() => {
    const syncGuestCart = async () => {
      if (!token || guestItems.length === 0) return

      await api.post('/cart/sync', {
        items: guestItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      })

      clearGuestCart()
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }

    syncGuestCart().catch(() => {})
  }, [clearGuestCart, guestItems, queryClient, token])

  const authLoading = Boolean(token) && !user && meQuery.isPending

  if (authLoading) {
    return (
      <>
        <div className="route-loading">Loading your account...</div>
        <ToastContainer />
      </>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
        <Route path="/reset-password" element={<AuthPage mode="reset" />} />
        <Route element={<Shell />}>
          <Route index element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<ProtectedRoute authLoading={authLoading}><CheckoutPage /></ProtectedRoute>} />
          <Route path="/order-confirmation/:orderId" element={<ProtectedRoute authLoading={authLoading}><OrderConfirmationPage /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute authLoading={authLoading}><AccountPage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute authLoading={authLoading}><AdminPage /></AdminRoute>} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App

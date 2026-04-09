import { NavLink, useLocation, useParams } from 'react-router-dom'
import { Panel } from '../components/UI'

export function OrderConfirmationPage() {
  const location = useLocation()
  const { orderId } = useParams()
  const order = location.state

  return (
    <Panel>
      <span className="eyebrow">Order confirmed</span>
      <h2>Thank you. Your payment has been recorded.</h2>
      <p className="muted">
        Order reference {order?.order_number || `#${orderId}`}. Track status updates from your account dashboard.
      </p>
      <NavLink className="primary-button inline-action" to="/account">
        View account
      </NavLink>
    </Panel>
  )
}

import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { api, getMessage } from '../lib/api'
import { money } from '../lib/format'
import { Field, Panel, SectionHeader } from '../components/UI'
import { useState } from 'react'
import { useToastStore } from '../store/toast'

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null

export function CheckoutPage() {
  const [intentData, setIntentData] = useState(null)
  const navigate = useNavigate()
  const showToast = useToastStore((state) => state.showToast)

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: async () => (await api.get('/cart')).data,
  })

  const shippingForm = useForm({
    defaultValues: {
      full_name: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'United States',
    },
  })

  const createIntent = useMutation({
    mutationFn: async (values) =>
      (
        await api.post('/checkout/payment-intent', {
          shipping_address: values,
        })
      ).data,
    onSuccess: (data) => {
      setIntentData(data)
      showToast({
        type: 'success',
        title: 'Payment ready',
        message: 'Card collection is now available below.',
      })
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Checkout error',
        message: getMessage(error, 'Could not create payment intent.'),
      })
    },
  })

  const confirmOrder = useMutation({
    mutationFn: async (payload) => (await api.post('/checkout/confirm', payload)).data,
    onSuccess: (data) => {
      showToast({
        type: 'success',
        title: 'Order placed',
        message: 'Your payment was confirmed successfully.',
      })
      navigate(`/order-confirmation/${data.order.id}`, { state: data.order })
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Payment confirmation failed',
        message: getMessage(error, 'Your order could not be completed.'),
      })
    },
  })

  return (
    <section className="checkout-layout">
      <Panel>
        <SectionHeader title="Shipping" subtitle="Save shipping details, then collect card details through Stripe." />
        <form className="form-grid" onSubmit={shippingForm.handleSubmit((values) => createIntent.mutate(values))}>
          <Field label="Full name" register={shippingForm.register('full_name')} />
          <Field label="Phone" register={shippingForm.register('phone')} />
          <Field className="field-span-2" label="Address line 1" register={shippingForm.register('line1')} />
          <Field className="field-span-2" label="Address line 2" register={shippingForm.register('line2')} />
          <Field label="City" register={shippingForm.register('city')} />
          <Field label="State" register={shippingForm.register('state')} />
          <Field label="Postal code" register={shippingForm.register('postal_code')} />
          <Field label="Country" register={shippingForm.register('country')} />
          <button className="primary-button" type="submit">Create payment intent</button>
        </form>
      </Panel>
      <Panel>
        <h3>Order summary</h3>
        <div className="summary-row"><span>Subtotal</span><strong>{money(cartQuery.data?.summary?.subtotal)}</strong></div>
        <div className="summary-row"><span>Shipping</span><strong>{money(15)}</strong></div>
        <div className="summary-row"><span>Tax</span><strong>{money((cartQuery.data?.summary?.subtotal || 0) * 0.1)}</strong></div>
        {!stripePromise && <p className="notice">Add `VITE_STRIPE_PUBLISHABLE_KEY` to enable card collection.</p>}
        {intentData?.client_secret && stripePromise && (
          <Elements options={{ clientSecret: intentData.client_secret }} stripe={stripePromise}>
            <PaymentStep
              confirmOrder={confirmOrder}
              intentData={intentData}
              shippingAddress={shippingForm.getValues()}
            />
          </Elements>
        )}
      </Panel>
    </section>
  )
}

function PaymentStep({ confirmOrder, intentData, shippingAddress }) {
  const stripe = useStripe()
  const elements = useElements()
  const showToast = useToastStore((state) => state.showToast)

  const submitPayment = async () => {
    if (!stripe || !elements) return

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (error) {
      showToast({
        type: 'error',
        title: 'Payment failed',
        message: error.message,
      })
      return
    }

    confirmOrder.mutate({
      payment_intent_id: paymentIntent.id,
      shipping_address: shippingAddress,
    })
  }

  return (
    <div className="stack">
      <PaymentElement />
      <button className="primary-button" onClick={submitPayment} type="button">
        Pay {money(intentData.totals.total)}
      </button>
    </div>
  )
}

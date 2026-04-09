import { useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { api, getMessage } from '../lib/api'
import { money, statusClass } from '../lib/format'
import { Field, Panel, SectionHeader } from '../components/UI'
import { useToastStore } from '../store/toast'

export function AccountPage() {
  const profileForm = useForm()
  const showToast = useToastStore((state) => state.showToast)

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => (await api.get('/account/profile')).data.profile,
  })

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: async () => (await api.get('/account/orders')).data.orders,
  })

  useEffect(() => {
    if (profileQuery.data?.user) {
      profileForm.reset({
        name: profileQuery.data.user.name,
        phone: profileQuery.data.user.phone || '',
      })
    }
  }, [profileForm, profileQuery.data])

  const updateProfile = useMutation({
    mutationFn: async (values) => (await api.put('/account/profile', values)).data,
    onSuccess: () => {
      profileQuery.refetch()
      showToast({
        type: 'success',
        title: 'Profile updated',
        message: 'Your account details were saved successfully.',
      })
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Profile update failed',
        message: getMessage(error, 'Could not save profile changes.'),
      })
    },
  })

  return (
    <section className="dashboard-grid">
      <Panel>
        <SectionHeader title="Profile" subtitle="Update your core account details." />
        <form className="form-grid" onSubmit={profileForm.handleSubmit((values) => updateProfile.mutate(values))}>
          <Field label="Name" register={profileForm.register('name')} />
          <Field label="Phone" register={profileForm.register('phone')} />
          <button className="primary-button" type="submit">Save profile</button>
        </form>
      </Panel>
      <Panel>
        <SectionHeader title="Order history" subtitle="Review completed orders and current fulfillment state." />
        <div className="stack">
          {ordersQuery.data?.map((order) => (
            <article className="order-row" key={order.id}>
              <div>
                <strong>{order.order_number}</strong>
                <p>{order.items.length} item(s)</p>
              </div>
              <div>
                <span className={statusClass(order.status)}>{order.status}</span>
                <p>{money(order.total)}</p>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </section>
  )
}

import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Field, Panel } from '../components/UI'
import { api, getMessage } from '../lib/api'
import { useAuthStore } from '../store/auth'
import { useToastStore } from '../store/toast'

export function AuthPage({ mode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((state) => state.setAuth)
  const showToast = useToastStore((state) => state.showToast)
  const form = useForm()

  const authMutation = useMutation({
    mutationFn: async (values) => {
      if (mode === 'login') return (await api.post('/auth/login', values)).data
      if (mode === 'register') return (await api.post('/auth/register', values)).data
      if (mode === 'forgot') return (await api.post('/auth/forgot-password', values)).data
      return (await api.post('/auth/reset-password', values)).data
    },
    onSuccess: (data) => {
      if (data.token) {
        setAuth({ token: data.token, user: data.user })
        showToast({
          type: 'success',
          title: mode === 'login' ? 'Login successful' : 'Account created',
          message: `Welcome ${data.user.name}.`,
        })
        navigate(location.state?.from?.pathname || '/')
        return
      }

      if (mode === 'forgot' && data.reset_token) {
        form.setValue('token', data.reset_token)
        showToast({
          type: 'info',
          title: 'Reset token created',
          message: 'Use the token below to set a new password.',
        })
      }

      if (mode === 'reset') {
        showToast({
          type: 'success',
          title: 'Password reset',
          message: 'You can now sign in with your new password.',
        })
        navigate('/login')
      }
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Request failed',
        message: getMessage(error),
      })
    },
  })

  const titles = {
    login: 'Sign in',
    register: 'Create account',
    forgot: 'Password reset',
    reset: 'Set new password',
  }

  return (
    <div className="auth-shell">
      <Panel className="auth-panel">
        <span className="eyebrow">{titles[mode]}</span>
        <h2>{titles[mode]}</h2>
        <form className="form-grid" onSubmit={form.handleSubmit((values) => authMutation.mutate(values))}>
          {(mode === 'login' || mode === 'register' || mode === 'forgot' || mode === 'reset') && (
            <Field label="Email" register={form.register('email')} />
          )}
          {mode === 'register' && <Field label="Name" register={form.register('name')} />}
          {mode === 'register' && <Field label="Phone" register={form.register('phone')} />}
          {(mode === 'login' || mode === 'register' || mode === 'reset') && (
            <Field label="Password" type="password" register={form.register('password')} />
          )}
          {(mode === 'register' || mode === 'reset') && (
            <Field label="Confirm password" type="password" register={form.register('password_confirmation')} />
          )}
          {mode === 'reset' && <Field label="Reset token" register={form.register('token')} />}
          {authMutation.isError && <p className="notice">{getMessage(authMutation.error)}</p>}
          {mode === 'forgot' && authMutation.data?.reset_token && (
            <p className="notice">Local reset token: {authMutation.data.reset_token}</p>
          )}
          <button className="primary-button" type="submit">Continue</button>
        </form>
        <div className="auth-links">
          {mode !== 'login' && <NavLink to="/login">Back to login</NavLink>}
          {mode === 'login' && <NavLink to="/register">Create account</NavLink>}
          {mode === 'login' && <NavLink to="/forgot-password">Forgot password?</NavLink>}
          {mode === 'forgot' && <NavLink to="/reset-password">Already have token</NavLink>}
        </div>
      </Panel>
    </div>
  )
}

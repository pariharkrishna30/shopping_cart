import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('eshopping-auth')

  if (raw) {
    const state = JSON.parse(raw)
    const token = state?.state?.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

export const getMessage = (error, fallback = 'Something went wrong.') =>
  error?.response?.data?.message || fallback

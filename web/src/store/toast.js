import { create } from 'zustand'

let toastId = 0

export const useToastStore = create((set) => ({
  toasts: [],
  showToast: ({ type = 'info', title, message, duration = 3200 }) => {
    const id = ++toastId

    set((state) => ({
      toasts: state.toasts.concat({ id, type, title, message }),
    }))

    window.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }))
    }, duration)
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}))

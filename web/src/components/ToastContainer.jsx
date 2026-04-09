import { useToastStore } from '../store/toast'

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div className={`toast toast-${toast.type}`} key={toast.id} role="status">
          <div className="toast-copy">
            {toast.title && <strong>{toast.title}</strong>}
            {toast.message && <span>{toast.message}</span>}
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)} type="button">
            Close
          </button>
        </div>
      ))}
    </div>
  )
}

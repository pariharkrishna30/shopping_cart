import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: ({ token, user }) => set({ token, user }),
      setUser: (user) => set((state) => ({ ...state, user })),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: 'eshopping-auth',
    },
  ),
)

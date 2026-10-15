import { create } from "zustand"
import { persist } from "zustand/middleware"

import { AUTH_SESSION_STORAGE_KEY } from "./constants"
import type { AuthSession, AuthSessionState } from "./interfaces"

const initialSessionState = {
  accessToken: null,
  tokenType: null,
  expiresAt: null,
  user: null,
  isAuthenticated: false,
}

export const useAuthSessionStore = create<AuthSessionState>()(
  persist(
    (set) => ({
      ...initialSessionState,

      setSession: (session: AuthSession) =>
        set({
          accessToken: session.accessToken,
          tokenType: session.tokenType,
          expiresAt: session.expiresAt,
          user: session.user,
          isAuthenticated: true,
        }),

      clearSession: () => set(initialSessionState),
    }),
    {
      name: AUTH_SESSION_STORAGE_KEY,

      partialize: (state) => ({
        accessToken: state.accessToken,
        tokenType: state.tokenType,
        expiresAt: state.expiresAt,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

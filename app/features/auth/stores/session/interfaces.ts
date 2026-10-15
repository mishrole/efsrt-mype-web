import type { AuthenticatedUser } from "../../../../services/auth/login/interfaces"

export interface AuthSession {
  accessToken: string
  tokenType: string
  expiresAt: string
  user: AuthenticatedUser
}

export interface AuthSessionState {
  accessToken: string | null
  tokenType: string | null
  expiresAt: string | null
  user: AuthenticatedUser | null
  isAuthenticated: boolean
  setSession: (session: AuthSession) => void
  clearSession: () => void
}

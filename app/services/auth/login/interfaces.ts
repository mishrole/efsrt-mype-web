export interface LoginRequest {
  email: string
  password: string
}

export interface AuthenticatedUser {
  id: string
  email: string
  displayName: string
  status: number
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresAt: string
  user: AuthenticatedUser
}

export interface RegisterRequest {
  displayName: string
  email: string
  password: string
  passwordConfirmation: string
}

export interface RegisterResponse {
  id: string
  displayName: string
  email: string
}

import type { InputHTMLAttributes } from "react"

export interface PasswordFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string
  error?: string
}

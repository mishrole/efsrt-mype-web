import type { UseFormReturn } from "react-hook-form"
import type { LoginFormValues } from "../../schema"

export interface UseLoginResult {
  form: UseFormReturn<LoginFormValues>
  submitError: string
  isSubmitting: boolean
  submit: (values: LoginFormValues) => Promise<void>
}

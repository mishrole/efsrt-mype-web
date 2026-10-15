import type { UseFormReturn } from "react-hook-form"
import type { RegisterFormValues } from "../../schema"

export interface UseRegisterResult {
  form: UseFormReturn<RegisterFormValues>
  submitError: string
  isSubmitting: boolean
  submit: (values: RegisterFormValues) => Promise<void>
}

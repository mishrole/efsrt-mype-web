import type { FinancialMovementType } from "~/features/financial-movements/constants"
import type { FinancialMovementFormValues } from "./schema"

export interface FinancialMovementFormProps {
  type: FinancialMovementType
  defaultValues?: FinancialMovementFormValues
  isSubmitting: boolean
  isReadOnly?: boolean
  submitLabel: string
  onSubmit: (values: FinancialMovementFormValues) => Promise<void>
  onCancel: () => void
}

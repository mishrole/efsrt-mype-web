import type { CategoryListItemResponse } from "~/services/categories/list-categories/interfaces"
import type { FinancialMovementItemResponse } from "~/services/financial-movements/interfaces"
import type { ExpenseItemFormValues } from "./schema"
export interface ExpenseItemFormProps {
  categories: CategoryListItemResponse[]
  item: FinancialMovementItemResponse | null
  isSubmitting: boolean
  onSubmit: (values: ExpenseItemFormValues) => Promise<void>
  onCancel: () => void
}

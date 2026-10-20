import type { FinancialMovementItemResponse } from "~/services/financial-movements/interfaces"
import type { ProductListItemResponse } from "~/services/products/list-products/interfaces"
import type { SaleItemFormValues } from "./schema"
export interface SaleItemFormProps {
  products: ProductListItemResponse[]
  item: FinancialMovementItemResponse | null
  isSubmitting: boolean
  onSubmit: (values: SaleItemFormValues) => Promise<void>
  onCancel: () => void
}

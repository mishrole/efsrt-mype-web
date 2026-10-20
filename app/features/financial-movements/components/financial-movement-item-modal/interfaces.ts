import type { FinancialMovementType } from "~/features/financial-movements/constants"
import type { CategoryListItemResponse } from "~/services/categories/list-categories/interfaces"
import type { FinancialMovementItemResponse } from "~/services/financial-movements/interfaces"
import type { ProductListItemResponse } from "~/services/products/list-products/interfaces"
export interface FinancialMovementItemModalProps {
  isOpen: boolean
  movementType: FinancialMovementType
  item: FinancialMovementItemResponse | null
  products: ProductListItemResponse[]
  categories: CategoryListItemResponse[]
  isSubmitting: boolean
  onClose: () => void
  onSubmitSale: (values: {
    productId: string
    quantity: number
    unitAmount: number
  }) => Promise<void>
  onSubmitExpense: (values: {
    categoryId: string
    description: string
    quantity: number
    unitAmount: number
  }) => Promise<void>
}

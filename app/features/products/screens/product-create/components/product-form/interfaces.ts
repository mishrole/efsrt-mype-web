import type { CategoryListItemResponse } from "~/services/categories/list-categories/interfaces"

export interface ProductFormValues {
  name: string
  categoryId: string
  salePrice: number
  unitCost: number
}

export interface ProductFormProps {
  categories: CategoryListItemResponse[]
  isSubmitting: boolean
  onSubmit: (values: ProductFormValues) => Promise<void>
  onCancel: () => void
}

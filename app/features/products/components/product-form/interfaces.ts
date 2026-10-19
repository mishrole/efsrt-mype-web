import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"

export interface ProductFormValues {
  name: string
  productCategoryId: string
  salePrice: number
  unitCost: number
}

export interface ProductFormProps {
  productCategories: ProductCategoryResponse[]
  defaultValues?: ProductFormValues
  isSubmitting: boolean
  isReadOnly?: boolean
  submitLabel: string
  onSubmit: (values: ProductFormValues) => Promise<void>
  onCancel: () => void
}

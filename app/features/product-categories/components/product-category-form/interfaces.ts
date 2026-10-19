import type { ProductCategoryFormValues } from "./schema"
export interface ProductCategoryFormProps {
  defaultValues?: ProductCategoryFormValues
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: ProductCategoryFormValues) => Promise<void>
  onCancel: () => void
}

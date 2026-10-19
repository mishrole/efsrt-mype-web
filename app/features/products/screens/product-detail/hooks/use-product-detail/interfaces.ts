import type { ProductFormValues } from "~/features/products/components/product-form/interfaces"
import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"
import type { ProductDetailResponse } from "~/services/products/get-product-detail/interfaces"

export interface ProductDetailScope {
  businessId: string
  productId: string
}

export interface ScopedProductDetail {
  scope: ProductDetailScope
  product: ProductDetailResponse
}

export interface UseProductDetailResult {
  product: ProductDetailResponse | null
  productCategories: ProductCategoryResponse[]
  canUpdate: boolean
  isLoading: boolean
  isSubmitting: boolean
  error: string
  categoriesError: string
  submitProduct: (values: ProductFormValues) => Promise<void>
  reloadProduct: () => Promise<void>
  returnToProducts: () => void
}

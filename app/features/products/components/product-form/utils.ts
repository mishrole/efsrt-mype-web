import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"

export function getProductCategoryName(
  productCategory: ProductCategoryResponse,
): string {
  return productCategory.name
}

import { PRODUCT_STATUS_FILTERS } from "~/features/products/constants"
import type { ProductFiltersProps, ProductFilterValues } from "./interfaces"

export function getProductCategoryLabel(
  productCategoryId: string,
  productCategories: ProductFiltersProps["productCategories"],
): string {
  if (productCategoryId === "all") {
    return "Todas"
  }

  return (
    productCategories.find(
      (productCategory) => productCategory.id === productCategoryId,
    )?.name ?? "Todas"
  )
}

export function getStatusLabel(status: ProductFilterValues["status"]): string {
  if (status === PRODUCT_STATUS_FILTERS.active) {
    return "Activos"
  }

  if (status === PRODUCT_STATUS_FILTERS.inactive) {
    return "Inactivos"
  }

  return "Todos"
}

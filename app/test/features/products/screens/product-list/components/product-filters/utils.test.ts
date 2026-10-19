import { describe, expect, it } from "vitest"
import { PRODUCT_STATUS_FILTERS } from "~/features/products/constants"
import {
  getProductCategoryLabel,
  getStatusLabel,
} from "~/features/products/screens/product-list/components/product-filters/utils"

const productCategories = [
  {
    id: "product-category-id",
    businessId: "business-id",
    name: "Bebidas",
    color: "#3F6FC4",
    isDefault: false,
    isActive: true,
    deactivatedAt: null,
    createdAt: "",
    updatedAt: "",
    version: 1,
  },
]

describe("product filter utilities", () => {
  it("returns the all-categories label", () => {
    expect(getProductCategoryLabel("all", productCategories)).toBe("Todas")
  })

  it("returns the matching product-category label", () => {
    expect(
      getProductCategoryLabel("product-category-id", productCategories),
    ).toBe("Bebidas")
  })

  it("returns the fallback label for an unknown category", () => {
    expect(getProductCategoryLabel("missing-id", productCategories)).toBe(
      "Todas",
    )
  })

  it.each([
    [PRODUCT_STATUS_FILTERS.active, "Activos"],
    [PRODUCT_STATUS_FILTERS.inactive, "Inactivos"],
    [PRODUCT_STATUS_FILTERS.all, "Todos"],
  ] as const)("maps status %s to %s", (status, expectedLabel) => {
    expect(getStatusLabel(status)).toBe(expectedLabel)
  })
})

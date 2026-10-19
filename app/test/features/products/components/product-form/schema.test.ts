import { describe, expect, it } from "vitest"
import { productFormSchema } from "~/features/products/components/product-form/schema"

describe("productFormSchema", () => {
  it("accepts a valid product including zero amounts", () => {
    expect(
      productFormSchema.safeParse({
        name: "Gaseosa 500 ml",
        productCategoryId: "product-category-id",
        salePrice: 0,
        unitCost: 0,
      }).success,
    ).toBe(true)
  })

  it.each([
    {
      values: {
        name: " ",
        productCategoryId: "product-category-id",
        salePrice: 1,
        unitCost: 1,
      },
      message: "El nombre es obligatorio.",
    },
    {
      values: {
        name: "Producto",
        productCategoryId: "",
        salePrice: 1,
        unitCost: 1,
      },
      message: "La categoría de producto es obligatoria.",
    },
    {
      values: {
        name: "Producto",
        productCategoryId: "product-category-id",
        salePrice: -1,
        unitCost: 1,
      },
      message: "El precio de venta no puede ser negativo.",
    },
    {
      values: {
        name: "Producto",
        productCategoryId: "product-category-id",
        salePrice: 1,
        unitCost: 1.234,
      },
      message: "El coste unitario admite máximo dos decimales.",
    },
  ])("rejects invalid values: $message", ({ values, message }) => {
    const result = productFormSchema.safeParse(values)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toContain(
        message,
      )
    }
  })
})

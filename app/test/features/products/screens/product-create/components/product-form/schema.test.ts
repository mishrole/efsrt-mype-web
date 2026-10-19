import { describe, expect, it } from "vitest"
import { productFormSchema } from "~/features/products/screens/product-create/components/product-form/schema"

describe("productFormSchema", () => {
  it("accepts a valid product", () => {
    expect(
      productFormSchema.safeParse({
        name: "Gaseosa",
        categoryId: "category-id",
        salePrice: 3.5,
        unitCost: 2.2,
      }).success,
    ).toBe(true)
  })

  it("rejects missing, excessive and negative values", () => {
    const result = productFormSchema.safeParse({
      name: "x".repeat(161),
      categoryId: "",
      salePrice: -1,
      unitCost: -1,
    })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues).toHaveLength(4)
  })
})

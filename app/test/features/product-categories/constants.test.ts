import { describe, expect, it } from "vitest"
import {
  PRODUCT_CATEGORY_COLORS,
  PRODUCT_CATEGORY_NEUTRAL_COLOR,
} from "~/features/product-categories/constants"
describe("product category palette", () => {
  it("contains the approved accessible colors", () => {
    expect(PRODUCT_CATEGORY_NEUTRAL_COLOR).toBe("#64748B")
    expect(PRODUCT_CATEGORY_COLORS).toHaveLength(8)
    expect(new Set(PRODUCT_CATEGORY_COLORS).size).toBe(8)
  })
})

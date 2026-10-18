import { describe, expect, it } from "vitest"
import { formatMoney } from "~/features/products/screens/product-list/components/product-card/utils"

describe("formatMoney", () => {
  it("formats monetary values with the business currency", () => {
    expect(formatMoney(3.5, "PEN")).toContain("3.50")
  })
})

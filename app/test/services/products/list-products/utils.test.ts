import { describe, expect, it } from "vitest"
import { createProductsQuery } from "~/services/products/list-products/utils"

describe("createProductsQuery", () => {
  it("returns an empty query without filters", () => {
    expect(createProductsQuery({})).toBe("")
  })

  it("trims search and includes every filter", () => {
    expect(
      createProductsQuery({
        search: "  gaseosa  ",
        categoryId: "category-id",
        isActive: false,
        availableForSale: true,
      }),
    ).toBe(
      "?search=gaseosa&categoryId=category-id&isActive=false&availableForSale=true",
    )
  })

  it("omits an empty search and preserves false availability", () => {
    expect(
      createProductsQuery({
        search: "   ",
        availableForSale: false,
      }),
    ).toBe("?availableForSale=false")
  })
})

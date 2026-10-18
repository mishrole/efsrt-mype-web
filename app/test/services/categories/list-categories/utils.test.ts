import { describe, expect, it } from "vitest"
import { CategoryType } from "~/services/categories/interfaces"
import { createCategoriesQuery } from "~/services/categories/list-categories/utils"

describe("createCategoriesQuery", () => {
  it("returns an empty query without filters", () => {
    expect(createCategoriesQuery({})).toBe("")
  })

  it("includes the category type and active state", () => {
    expect(
      createCategoriesQuery({
        type: CategoryType.Sale,
        isActive: false,
      }),
    ).toBe("?type=1&isActive=false")
  })
})

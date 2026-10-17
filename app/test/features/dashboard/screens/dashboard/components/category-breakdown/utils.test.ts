import { describe, expect, it } from "vitest"
import {
  calculateCategoryChartHeight,
  createCategoryChartData,
  formatCategoryAmount,
  formatCompactCategoryAmount,
} from "../../../../../../../features/dashboard/screens/dashboard/components/category-breakdown/utils"

describe("category breakdown utilities", () => {
  it("sorts categories by amount without mutating the source and limits the result", () => {
    const categories = Array.from({ length: 8 }, (_, index) => ({
      categoryId: `category-${index}`,
      categoryName: `Categoría ${index}`,
      categoryIsActive: true,
      amount: index * 100,
      percentage: index * 2,
    }))
    const sourceOrder = categories.map((category) => category.categoryId)

    const result = createCategoryChartData(categories)

    expect(result).toHaveLength(6)
    expect(result[0].amount).toBe(700)
    expect(result[5].amount).toBe(200)
    expect(categories.map((category) => category.categoryId)).toEqual(
      sourceOrder,
    )
  })

  it("uses the minimum height and grows with the category count", () => {
    expect(calculateCategoryChartHeight(0)).toBe(220)
    expect(calculateCategoryChartHeight(2)).toBe(220)
    expect(calculateCategoryChartHeight(6)).toBe(360)
  })

  it("formats full and compact category amounts", () => {
    expect(formatCategoryAmount(1250.5, "PEN")).toMatch(/S\/\s?1,250\.50/)
    expect(formatCompactCategoryAmount(1250, "PEN")).toMatch(/S\/\s?1\.3K/i)
  })
})

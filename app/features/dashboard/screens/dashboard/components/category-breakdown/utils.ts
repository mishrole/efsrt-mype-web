import type { CategoryAmount } from "../../../../../../services/financial-dashboard/get-financial-dashboard/interfaces"

const MINIMUM_CHART_HEIGHT = 220
const CATEGORY_ROW_HEIGHT = 48
const CHART_VERTICAL_PADDING = 72

export function createCategoryChartData(
  categories: CategoryAmount[],
): CategoryAmount[] {
  return [...categories]
    .sort((left, right) => right.amount - left.amount)
    .slice(0, 6)
}

export function calculateCategoryChartHeight(categoryCount: number): number {
  return Math.max(
    MINIMUM_CHART_HEIGHT,
    categoryCount * CATEGORY_ROW_HEIGHT + CHART_VERTICAL_PADDING,
  )
}

export function formatCategoryAmount(
  value: number,
  currencyCode: string,
): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatCompactCategoryAmount(
  value: number,
  currencyCode: string,
): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currencyCode,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

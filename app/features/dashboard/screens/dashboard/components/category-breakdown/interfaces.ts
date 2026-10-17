import type { CategoryAmount } from "../../../../../../services/financial-dashboard/get-financial-dashboard/interfaces"

export interface CategoryBreakdownProps {
  title: string
  categories: CategoryAmount[]
  currencyCode: string
  color?: string
}

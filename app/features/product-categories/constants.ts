export const PRODUCT_CATEGORY_PERMISSIONS = {
  read: "PRODUCT_CATEGORY_READ",
  create: "PRODUCT_CATEGORY_CREATE",
  update: "PRODUCT_CATEGORY_UPDATE",
  deactivate: "PRODUCT_CATEGORY_DEACTIVATE",
  reactivate: "PRODUCT_CATEGORY_REACTIVATE",
} as const

export const PRODUCT_CATEGORY_STATUS_FILTERS = {
  all: "all",
  active: "active",
  inactive: "inactive",
} as const
export type ProductCategoryStatusFilter =
  (typeof PRODUCT_CATEGORY_STATUS_FILTERS)[keyof typeof PRODUCT_CATEGORY_STATUS_FILTERS]

export const PRODUCT_CATEGORY_NEUTRAL_COLOR = "#64748B"
export const PRODUCT_CATEGORY_COLORS = [
  "#3F6FC4",
  "#6751C3",
  "#9C3EAD",
  "#B63F6B",
  "#C94F35",
  "#B65318",
  "#2F855A",
  "#247F7D",
] as const

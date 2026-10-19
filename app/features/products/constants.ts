export const PRODUCT_PERMISSIONS = {
  read: "PRODUCT_READ",
  create: "PRODUCT_CREATE",
  update: "PRODUCT_UPDATE",
  deactivate: "PRODUCT_DEACTIVATE",
  reactivate: "PRODUCT_REACTIVATE",
} as const

export const PRODUCT_STATUS_FILTERS = {
  all: "all",
  active: "active",
  inactive: "inactive",
} as const

export type ProductStatusFilter =
  (typeof PRODUCT_STATUS_FILTERS)[keyof typeof PRODUCT_STATUS_FILTERS]

export const PRODUCT_FINANCIAL_CATEGORY_NAME = "Productos"

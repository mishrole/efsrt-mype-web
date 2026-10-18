export const DASHBOARD_PERMISSIONS = {
  movementCreate: "MOVEMENT_CREATE",
  productCreate: "PRODUCT_CREATE",
} as const

export const NEW_ITEM_TYPES = {
  sale: "sale",
  expense: "expense",
  product: "product",
} as const

export type NewItemType = (typeof NEW_ITEM_TYPES)[keyof typeof NEW_ITEM_TYPES]

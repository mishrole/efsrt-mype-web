export const FINANCIAL_MOVEMENT_PERMISSIONS = {
  read: "MOVEMENT_READ",
  create: "MOVEMENT_CREATE",
  update: "MOVEMENT_UPDATE",
  confirm: "MOVEMENT_CONFIRM",
} as const

export const FINANCIAL_MOVEMENT_TYPES = {
  sale: 1,
  expense: 2,
  openingBalance: 3,
} as const

export const FINANCIAL_MOVEMENT_STATUS = {
  draft: 1,
} as const

export type FinancialMovementType =
  (typeof FINANCIAL_MOVEMENT_TYPES)[keyof typeof FINANCIAL_MOVEMENT_TYPES]

export type FinancialMovementTypeRoute = "sale" | "expense"

export const FINANCIAL_MOVEMENT_DESCRIPTION_MAX_LENGTH = 500

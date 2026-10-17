export interface CreateBusinessRequest {
  displayName: string
  legalName: string
  ruc: string
  currencyCode: string
  openingBalanceAmount: number
  openingBalanceDate: string
}

export interface CreatedCategory {
  id: string
  name: string
  type: number
  isDefault: boolean
  isActive: boolean
}

export interface CreateBusinessResponse {
  businessId: string
  displayName: string
  currencyCode: string
  membershipId: string
  roleCode: string
  defaultCategories: CreatedCategory[]
  openingBalanceMovementId: string
  openingBalanceAmount: number
  openingBalanceDate: string
  version: number
}

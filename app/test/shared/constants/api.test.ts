import { describe, expect, it } from "vitest"
import { API_ROUTES } from "~/shared/constants/api"

describe("financial movement item API routes", () => {
  const businessId = "business-id"
  const movementId = "movement-id"
  const itemId = "item-id"

  it("builds the active item list route", () => {
    expect(API_ROUTES.FINANCIAL_MOVEMENT_ITEMS(businessId, movementId)).toBe(
      "/api/v1/businesses/business-id/financial-movements/movement-id/items",
    )
  })

  it("builds sale item routes", () => {
    expect(API_ROUTES.SALE_ITEMS(businessId, movementId)).toBe(
      "/api/v1/businesses/business-id/financial-movements/movement-id/sale-items",
    )
    expect(API_ROUTES.SALE_ITEM_DETAIL(businessId, movementId, itemId)).toBe(
      "/api/v1/businesses/business-id/financial-movements/movement-id/sale-items/item-id",
    )
  })

  it("builds expense item routes", () => {
    expect(API_ROUTES.EXPENSE_ITEMS(businessId, movementId)).toBe(
      "/api/v1/businesses/business-id/financial-movements/movement-id/expense-items",
    )
    expect(API_ROUTES.EXPENSE_ITEM_DETAIL(businessId, movementId, itemId)).toBe(
      "/api/v1/businesses/business-id/financial-movements/movement-id/expense-items/item-id",
    )
  })

  it("builds item detail and retirement routes", () => {
    expect(
      API_ROUTES.FINANCIAL_MOVEMENT_ITEM_DETAIL(businessId, movementId, itemId),
    ).toBe(
      "/api/v1/businesses/business-id/financial-movements/movement-id/items/item-id",
    )
    expect(
      API_ROUTES.FINANCIAL_MOVEMENT_ITEM_RETIRE(businessId, movementId, itemId),
    ).toBe(
      "/api/v1/businesses/business-id/financial-movements/movement-id/items/item-id/retire",
    )
  })
})

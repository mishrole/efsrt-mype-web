import { beforeEach, describe, expect, it } from "vitest"
import { useBusinessContextStore } from "../../../../../features/business/stores/business-context"

describe("business context store", () => {
  beforeEach(() => {
    localStorage.clear()
    useBusinessContextStore.getState().clearBusinessContext()
  })

  it("stores businesses and selects a business while clearing its previous context", () => {
    const business = {
      businessId: "business-id",
      displayName: "Pepito Grillo S.A.C.",
      currencyCode: "PEN",
      status: 1,
      membershipId: "membership-id",
      roleCode: "OWNER",
    }
    const context = {
      businessId: business.businessId,
      displayName: business.displayName,
      currencyCode: business.currencyCode,
      membershipId: business.membershipId,
      roleId: "role-id",
      roleCode: business.roleCode,
      permissions: ["DASHBOARD_READ"],
    }

    useBusinessContextStore.getState().setBusinesses([business])
    useBusinessContextStore.getState().setContext(context)
    useBusinessContextStore.getState().selectBusiness(business.businessId)

    expect(useBusinessContextStore.getState()).toMatchObject({
      businesses: [business],
      currentBusinessId: business.businessId,
      context: null,
    })
  })

  it("clears the complete business context", () => {
    useBusinessContextStore.getState().selectBusiness("business-id")
    useBusinessContextStore.getState().clearBusinessContext()

    expect(useBusinessContextStore.getState()).toMatchObject({
      businesses: [],
      currentBusinessId: null,
      context: null,
    })
  })
})

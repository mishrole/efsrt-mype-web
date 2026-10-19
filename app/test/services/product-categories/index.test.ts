import { describe, expect, it, vi } from "vitest"
import {
  createProductCategory,
  listProductCategories,
  reactivateProductCategory,
} from "~/services/product-categories"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({ request: vi.fn() }))
const requestMock = vi.mocked(request)

describe("product categories services", () => {
  it("lists using normalized filters", async () => {
    requestMock.mockResolvedValue([])
    await listProductCategories(
      { businessId: "business-id", search: " bebidas ", isActive: false },
      "token",
    )
    expect(requestMock).toHaveBeenCalledWith(
      "/api/v1/businesses/business-id/product-categories?search=bebidas&isActive=false",
      { method: "GET", accessToken: "token", signal: undefined },
    )
  })

  it("creates quickly from Product", async () => {
    requestMock.mockResolvedValue({})
    await createProductCategory(
      "business-id",
      { name: "Bebidas", color: "#FFFFFF" },
      "token",
    )
    expect(requestMock).toHaveBeenCalledWith(
      "/api/v1/businesses/business-id/product-categories",
      {
        method: "POST",
        body: { name: "Bebidas", color: "#FFFFFF" },
        accessToken: "token",
      },
    )
  })

  it("reactivates the existing record after confirmation", async () => {
    requestMock.mockResolvedValue({})
    await reactivateProductCategory("business-id", "category-id", 17, "token")
    expect(requestMock).toHaveBeenCalledWith(
      "/api/v1/businesses/business-id/product-categories/category-id/reactivate",
      { method: "PATCH", body: { version: 17 }, accessToken: "token" },
    )
  })
})

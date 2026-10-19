import { describe, expect, it, vi } from "vitest"
import { createProduct } from "~/services/products/create-product"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({
  request: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe("createProduct service", () => {
  it("posts categoryId and productCategoryId", async () => {
    const controller = new AbortController()
    const payload = {
      name: "Gaseosa 500 ml",
      categoryId: "financial-category-id",
      productCategoryId: "product-category-id",
      salePrice: 3.5,
      unitCost: 2.2,
    }
    const response = {
      id: "product-id",
      businessId: "business-id",
      categoryId: payload.categoryId,
      categoryName: "Productos",
      name: payload.name,
      salePrice: payload.salePrice,
      unitCost: payload.unitCost,
      isActive: true,
      createdAt: "2026-10-18T05:00:00Z",
      updatedAt: "2026-10-18T05:00:00Z",
    }

    requestMock.mockResolvedValue(response)

    await expect(
      createProduct("business-id", payload, "access-token", controller.signal),
    ).resolves.toEqual(response)

    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.PRODUCTS("business-id"),
      {
        method: "POST",
        body: payload,
        accessToken: "access-token",
        signal: controller.signal,
      },
    )
  })
})

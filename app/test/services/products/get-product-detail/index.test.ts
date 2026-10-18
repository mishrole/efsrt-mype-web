import { describe, expect, it, vi } from "vitest"
import { CategoryType } from "~/services/categories/interfaces"
import { getProductDetail } from "~/services/products/get-product-detail"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({
  request: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe("getProductDetail service", () => {
  it("gets the business product and forwards the abort signal", async () => {
    const controller = new AbortController()
    const response = {
      id: "product-id",
      businessId: "business-id",
      categoryId: "category-id",
      categoryName: "Productos",
      categoryType: CategoryType.Sale,
      name: "Gaseosa 500 ml",
      salePrice: 3.5,
      unitCost: 2.2,
      isActive: true,
      createdAt: "2026-10-18T05:00:00Z",
      updatedAt: "2026-10-18T05:00:00Z",
      version: 41410,
    }

    requestMock.mockResolvedValue(response)

    await expect(
      getProductDetail(
        {
          businessId: "business-id",
          productId: "product-id",
        },
        "access-token",
        controller.signal,
      ),
    ).resolves.toEqual(response)

    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.PRODUCT_DETAIL("business-id", "product-id"),
      {
        method: "GET",
        accessToken: "access-token",
        signal: controller.signal,
      },
    )
  })
})

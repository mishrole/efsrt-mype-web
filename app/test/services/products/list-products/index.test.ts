import { describe, expect, it, vi } from "vitest"
import { listProducts } from "~/services/products/list-products"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({
  request: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe("listProducts service", () => {
  it("gets filtered products and forwards the abort signal", async () => {
    const controller = new AbortController()
    const response = [
      {
        id: "product-id",
        businessId: "business-id",
        categoryId: "category-id",
        categoryName: "Productos",
        name: "Gaseosa 500 ml",
        salePrice: 3.5,
        unitCost: 2.2,
        isActive: true,
      },
    ]

    requestMock.mockResolvedValue(response)

    await expect(
      listProducts(
        {
          businessId: "business-id",
          search: "gaseosa",
          categoryId: "category-id",
          isActive: true,
          availableForSale: false,
        },
        "access-token",
        controller.signal,
      ),
    ).resolves.toEqual(response)

    expect(requestMock).toHaveBeenCalledWith(
      `${API_ROUTES.PRODUCTS("business-id")}?search=gaseosa&categoryId=category-id&isActive=true&availableForSale=false`,
      {
        method: "GET",
        accessToken: "access-token",
        signal: controller.signal,
      },
    )
  })
})

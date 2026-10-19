import { describe, expect, it, vi } from "vitest"
import {
  deactivateProduct,
  reactivateProduct,
} from "~/services/products/change-product-status"
import { getProductDetail } from "~/services/products/get-product-detail"
import { listProducts } from "~/services/products/list-products"
import { createProductsQuery } from "~/services/products/list-products/utils"
import { updateProduct } from "~/services/products/update-product"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({ request: vi.fn() }))
const requestMock = vi.mocked(request)

describe("products services", () => {
  it("builds complete and empty list queries", () => {
    expect(
      createProductsQuery({
        search: " producto ",
        categoryId: "category-id",
        productCategoryId: "product-category-id",
        isActive: false,
        availableForSale: true,
      }),
    ).toBe(
      "?search=producto&categoryId=category-id&productCategoryId=product-category-id&isActive=false&availableForSale=true",
    )
    expect(createProductsQuery({ search: " " })).toBe("")
  })
  it("lists products", async () => {
    requestMock.mockResolvedValue([])
    const signal = new AbortController().signal
    await listProducts(
      { businessId: "business-id", productCategoryId: "product-category-id" },
      "token",
      signal,
    )
    expect(requestMock).toHaveBeenCalledWith(
      "/api/v1/businesses/business-id/products?productCategoryId=product-category-id",
      { method: "GET", accessToken: "token", signal },
    )
  })
  it("gets product detail", async () => {
    requestMock.mockResolvedValue({})
    await getProductDetail(
      { businessId: "business-id", productId: "product-id" },
      "token",
    )
    expect(requestMock).toHaveBeenCalledWith(
      "/api/v1/businesses/business-id/products/product-id",
      { method: "GET", accessToken: "token", signal: undefined },
    )
  })
  it("updates product", async () => {
    requestMock.mockResolvedValue({})
    const payload = {
      name: "Gaseosa",
      categoryId: "category-id",
      productCategoryId: "product-category-id",
      salePrice: 3.5,
      unitCost: 2.25,
      version: 1,
    }
    await updateProduct("business-id", "product-id", payload, "token")
    expect(requestMock).toHaveBeenCalledWith(
      "/api/v1/businesses/business-id/products/product-id",
      { method: "PUT", body: payload, accessToken: "token" },
    )
  })
  it("deactivates and reactivates product", async () => {
    requestMock.mockResolvedValue({})
    const values = {
      businessId: "business-id",
      productId: "product-id",
      version: 4,
    }
    await deactivateProduct(values, "token")
    await reactivateProduct(values, "token")
    expect(requestMock).toHaveBeenNthCalledWith(
      1,
      "/api/v1/businesses/business-id/products/product-id/deactivate",
      { method: "PATCH", body: { version: 4 }, accessToken: "token" },
    )
    expect(requestMock).toHaveBeenNthCalledWith(
      2,
      "/api/v1/businesses/business-id/products/product-id/reactivate",
      { method: "PATCH", body: { version: 4 }, accessToken: "token" },
    )
  })
})

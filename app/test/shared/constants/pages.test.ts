import { describe, expect, it } from "vitest"
import { APP_PAGES_ROUTES, APP_PATHS } from "~/shared/constants/pages"

describe("page constants", () => {
  it("defines the route segments", () => {
    expect(APP_PAGES_ROUTES).toEqual({
      LOGIN: "login",
      REGISTER: "register",
      DASHBOARD: "dashboard",
      PRODUCTS: "products",
      PRODUCT_CREATE: "products/create",
      PRODUCT_DETAIL: "products/:productId",
    })
  })

  it("defines the static absolute paths", () => {
    expect(APP_PATHS.HOME).toBe("/")
    expect(APP_PATHS.LOGIN).toBe("/login")
    expect(APP_PATHS.REGISTER).toBe("/register")
    expect(APP_PATHS.DASHBOARD).toBe("/dashboard")
    expect(APP_PATHS.PRODUCTS).toBe("/products")
    expect(APP_PATHS.PRODUCT_CREATE).toBe("/products/create")
  })

  it("builds the product detail path", () => {
    expect(APP_PATHS.PRODUCT_DETAIL("product-id")).toBe("/products/product-id")
  })
})

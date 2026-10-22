import { describe, expect, it } from "vitest"
import { APP_PAGES_ROUTES, APP_PATHS } from "~/shared/constants/pages"

describe("page constants", () => {
  it("defines the route segments", () => {
    expect(APP_PAGES_ROUTES).toEqual({
      LOGIN: "login",
      REGISTER: "register",
      DASHBOARD: "dashboard",
      PRODUCT_CATEGORIES: "product-categories",
      PRODUCT_CATEGORY_CREATE: "product-categories/create",
      PRODUCT_CATEGORY_DETAIL: "product-categories/:productCategoryId",
      FINANCIAL_MOVEMENT_DRAFTS: "financial-movements/drafts",
      FINANCIAL_MOVEMENTS: "financial-movements",
      FINANCIAL_MOVEMENT_CREATE: "financial-movements/create/:movementType",
      FINANCIAL_MOVEMENT_DETAIL: "financial-movements/:movementId",
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
    expect(APP_PATHS.PRODUCT_CATEGORIES).toBe("/product-categories")
    expect(APP_PATHS.PRODUCT_CATEGORY_CREATE).toBe("/product-categories/create")
    expect(APP_PATHS.FINANCIAL_MOVEMENTS).toBe("/financial-movements")
    expect(APP_PATHS.PRODUCTS).toBe("/products")
    expect(APP_PATHS.PRODUCT_CREATE).toBe("/products/create")
  })

  it("builds the product detail path", () => {
    expect(APP_PATHS.PRODUCT_DETAIL("product-id")).toBe("/products/product-id")
  })

  it("builds the product category detail path", () => {
    expect(APP_PATHS.PRODUCT_CATEGORY_DETAIL("product-category-id")).toBe(
      "/product-categories/product-category-id",
    )
  })

  it("build the financial movement create path", () => {
    expect(APP_PATHS.FINANCIAL_MOVEMENT_CREATE("sale")).toBe(
      "/financial-movements/create/sale",
    )
  })

  it("builds the financial movement detail path", () => {
    expect(APP_PATHS.FINANCIAL_MOVEMENT_DETAIL("movement-id")).toBe(
      "/financial-movements/movement-id",
    )
  })
})

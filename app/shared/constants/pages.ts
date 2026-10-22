export const APP_PAGES_ROUTES = {
  LOGIN: "login",
  REGISTER: "register",
  DASHBOARD: "dashboard",
  PRODUCT_CATEGORIES: "product-categories",
  PRODUCT_CATEGORY_CREATE: "product-categories/create",
  PRODUCT_CATEGORY_DETAIL: "product-categories/:productCategoryId",
  FINANCIAL_MOVEMENTS: "financial-movements",
  FINANCIAL_MOVEMENT_DRAFTS: "financial-movements/drafts",
  FINANCIAL_MOVEMENT_CREATE: "financial-movements/create/:movementType",
  FINANCIAL_MOVEMENT_DETAIL: "financial-movements/:movementId",
  PRODUCTS: "products",
  PRODUCT_CREATE: "products/create",
  PRODUCT_DETAIL: "products/:productId",
} as const

export const APP_PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PRODUCT_CATEGORIES: "/product-categories",
  PRODUCT_CATEGORY_CREATE: "/product-categories/create",
  PRODUCT_CATEGORY_DETAIL: (productCategoryId: string) =>
    `/product-categories/${productCategoryId}`,
  FINANCIAL_MOVEMENTS: "/financial-movements",
  FINANCIAL_MOVEMENT_DRAFTS: "/financial-movements/drafts",
  FINANCIAL_MOVEMENT_CREATE: (movementType: "sale" | "expense") =>
    `/financial-movements/create/${movementType}`,
  FINANCIAL_MOVEMENT_DETAIL: (movementId: string) =>
    `/financial-movements/${movementId}`,
  PRODUCTS: "/products",
  PRODUCT_CREATE: "/products/create",
  PRODUCT_DETAIL: (productId: string) => `/products/${productId}`,
} as const

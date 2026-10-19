export const APP_PAGES_ROUTES = {
  LOGIN: "login",
  REGISTER: "register",
  DASHBOARD: "dashboard",
  PRODUCT_CATEGORIES: "product-categories",
  PRODUCT_CATEGORY_CREATE: "product-categories/create",
  PRODUCT_CATEGORY_DETAIL: "product-categories/:productCategoryId",
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
  PRODUCTS: "/products",
  PRODUCT_CREATE: "/products/create",
  PRODUCT_DETAIL: (productId: string) => `/products/${productId}`,
} as const

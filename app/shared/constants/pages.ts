export const APP_PAGES_ROUTES = {
  LOGIN: "login",
  REGISTER: "register",
  DASHBOARD: "dashboard",
  PRODUCTS: "products",
  PRODUCT_CREATE: "products/create",
  PRODUCT_DETAIL: "products/:productId",
} as const

export const APP_PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PRODUCTS: "/products",
  PRODUCT_CREATE: "/products/create",
  PRODUCT_DETAIL: (productId: string) => `/products/${productId}`,
} as const

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    REFRESH: "/api/v1/auth/refresh",
    LOGOUT: "/api/v1/auth/logout",
  },
  BUSINESSES: "/api/v1/businesses",
  BUSINESS_CONTEXT: (businessId: string) =>
    `/api/v1/businesses/${businessId}/context`,
  CATEGORIES: (businessId: string) =>
    `/api/v1/businesses/${businessId}/categories`,
  PRODUCT_CATEGORIES: (businessId: string) =>
    `/api/v1/businesses/${businessId}/product-categories`,
  PRODUCT_CATEGORY_DETAIL: (businessId: string, productCategoryId: string) =>
    `/api/v1/businesses/${businessId}/product-categories/${productCategoryId}`,
  PRODUCTS: (businessId: string) => `/api/v1/businesses/${businessId}/products`,
  PRODUCT_DETAIL: (businessId: string, productId: string) =>
    `/api/v1/businesses/${businessId}/products/${productId}`,
  FINANCIAL_DASHBOARD: (businessId: string) =>
    `/api/v1/businesses/${businessId}/dashboard`,
} as const

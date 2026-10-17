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
  FINANCIAL_DASHBOARD: (businessId: string) =>
    `/api/v1/businesses/${businessId}/dashboard`,
} as const

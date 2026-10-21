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
  FINANCIAL_MOVEMENTS: (businessId: string) =>
    `/api/v1/businesses/${businessId}/financial-movements`,
  FINANCIAL_MOVEMENT_DETAIL: (businessId: string, movementId: string) =>
    `/api/v1/businesses/${businessId}/financial-movements/${movementId}`,
  FINANCIAL_MOVEMENT_CONFIRM: (businessId: string, movementId: string) =>
    `/api/v1/businesses/${businessId}/financial-movements/${movementId}/confirm`,
  FINANCIAL_MOVEMENT_ITEMS: (businessId: string, movementId: string) =>
    `/api/v1/businesses/${businessId}/financial-movements/${movementId}/items`,
  SALE_ITEMS: (businessId: string, movementId: string) =>
    `/api/v1/businesses/${businessId}/financial-movements/${movementId}/sale-items`,
  SALE_ITEM_DETAIL: (businessId: string, movementId: string, itemId: string) =>
    `/api/v1/businesses/${businessId}/financial-movements/${movementId}/sale-items/${itemId}`,
  EXPENSE_ITEMS: (businessId: string, movementId: string) =>
    `/api/v1/businesses/${businessId}/financial-movements/${movementId}/expense-items`,
  EXPENSE_ITEM_DETAIL: (
    businessId: string,
    movementId: string,
    itemId: string,
  ) =>
    `/api/v1/businesses/${businessId}/financial-movements/${movementId}/expense-items/${itemId}`,
  FINANCIAL_MOVEMENT_ITEM_DETAIL: (
    businessId: string,
    movementId: string,
    itemId: string,
  ) =>
    `${API_ROUTES.FINANCIAL_MOVEMENT_DETAIL(businessId, movementId)}/items/${itemId}`,
  FINANCIAL_MOVEMENT_ITEM_RETIRE: (
    businessId: string,
    movementId: string,
    itemId: string,
  ) =>
    `/api/v1/businesses/${businessId}/financial-movements/${movementId}/items/${itemId}/retire`,
  FINANCIAL_DASHBOARD: (businessId: string) =>
    `/api/v1/businesses/${businessId}/dashboard`,
  MOVEMENT_EVIDENCES: (businessId: string, movementId: string) =>
    `/api/v1/businesses/${businessId}/financial-movements/${movementId}/evidences`,
  MOVEMENT_EVIDENCE_DETAIL: (
    businessId: string,
    movementId: string,
    evidenceId: string,
  ) =>
    `/api/v1/businesses/${businessId}/financial-movements/${movementId}/evidences/${evidenceId}`,
  MOVEMENT_EVIDENCE_CONTENT: (
    businessId: string,
    movementId: string,
    evidenceId: string,
  ) =>
    `/api/v1/businesses/${businessId}/financial-movements/${movementId}/evidences/${evidenceId}/content`,
  MOVEMENT_EVIDENCE_REMOVE: (
    businessId: string,
    movementId: string,
    evidenceId: string,
  ) =>
    `/api/v1/businesses/${businessId}/financial-movements/${movementId}/evidences/${evidenceId}/remove`,
} as const

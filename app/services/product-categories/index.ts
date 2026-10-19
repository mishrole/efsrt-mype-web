import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type {
  CreateProductCategoryRequest,
  ProductCategoryFilters,
  ProductCategoryResponse,
  UpdateProductCategoryRequest,
} from "./interfaces"

export function createProductCategoriesQuery(
  filters: Omit<ProductCategoryFilters, "businessId">,
): string {
  const query = new URLSearchParams()
  const search = filters.search?.trim()
  if (search) {
    query.set("search", search)
  }
  if (filters.isActive !== undefined) {
    query.set("isActive", String(filters.isActive))
  }
  const value = query.toString()
  return value ? `?${value}` : ""
}

export function listProductCategories(
  filters: ProductCategoryFilters,
  accessToken: string,
  signal?: AbortSignal,
) {
  const query = createProductCategoriesQuery(filters)
  return request<ProductCategoryResponse[]>(
    `${API_ROUTES.PRODUCT_CATEGORIES(filters.businessId)}${query}`,
    { method: "GET", accessToken, signal },
  )
}

export function getProductCategoryDetail(
  businessId: string,
  productCategoryId: string,
  accessToken: string,
  signal?: AbortSignal,
) {
  return request<ProductCategoryResponse>(
    API_ROUTES.PRODUCT_CATEGORY_DETAIL(businessId, productCategoryId),
    { method: "GET", accessToken, signal },
  )
}

export function createProductCategory(
  businessId: string,
  payload: CreateProductCategoryRequest,
  accessToken: string,
) {
  return request<ProductCategoryResponse>(
    API_ROUTES.PRODUCT_CATEGORIES(businessId),
    { method: "POST", body: payload, accessToken },
  )
}

export function updateProductCategory(
  businessId: string,
  productCategoryId: string,
  payload: UpdateProductCategoryRequest,
  accessToken: string,
) {
  return request<ProductCategoryResponse>(
    API_ROUTES.PRODUCT_CATEGORY_DETAIL(businessId, productCategoryId),
    { method: "PUT", body: payload, accessToken },
  )
}

function changeProductCategoryStatus(
  businessId: string,
  productCategoryId: string,
  action: "deactivate" | "reactivate",
  version: number,
  accessToken: string,
) {
  return request<ProductCategoryResponse>(
    `${API_ROUTES.PRODUCT_CATEGORY_DETAIL(businessId, productCategoryId)}/${action}`,
    { method: "PATCH", body: { version }, accessToken },
  )
}

export function deactivateProductCategory(
  businessId: string,
  productCategoryId: string,
  version: number,
  accessToken: string,
) {
  return changeProductCategoryStatus(
    businessId,
    productCategoryId,
    "deactivate",
    version,
    accessToken,
  )
}

export function reactivateProductCategory(
  businessId: string,
  productCategoryId: string,
  version: number,
  accessToken: string,
) {
  return changeProductCategoryStatus(
    businessId,
    productCategoryId,
    "reactivate",
    version,
    accessToken,
  )
}

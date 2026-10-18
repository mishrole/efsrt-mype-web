import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type { CreateProductRequest, CreateProductResponse } from "./interfaces"

export function createProduct(
  businessId: string,
  payload: CreateProductRequest,
  accessToken: string,
  signal?: AbortSignal,
): Promise<CreateProductResponse> {
  return request<CreateProductResponse>(API_ROUTES.PRODUCTS(businessId), {
    method: "POST",
    body: payload,
    accessToken,
    signal,
  })
}

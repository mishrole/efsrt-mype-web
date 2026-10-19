import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type {
  ChangeProductStatusRequest,
  ChangeProductStatusResponse,
} from "./interfaces"
function changeProductStatus(
  values: ChangeProductStatusRequest,
  action: "deactivate" | "reactivate",
  accessToken: string,
) {
  return request<ChangeProductStatusResponse>(
    `${API_ROUTES.PRODUCT_DETAIL(values.businessId, values.productId)}/${action}`,
    { method: "PATCH", body: { version: values.version }, accessToken },
  )
}
export function deactivateProduct(
  values: ChangeProductStatusRequest,
  accessToken: string,
) {
  return changeProductStatus(values, "deactivate", accessToken)
}
export function reactivateProduct(
  values: ChangeProductStatusRequest,
  accessToken: string,
) {
  return changeProductStatus(values, "reactivate", accessToken)
}

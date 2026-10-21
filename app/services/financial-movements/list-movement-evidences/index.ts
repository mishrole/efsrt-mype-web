import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type { ListMovementEvidencesResponse } from "./interfaces"

export function listMovementEvidences(
  businessId: string,
  movementId: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<ListMovementEvidencesResponse> {
  return request<ListMovementEvidencesResponse>(
    API_ROUTES.MOVEMENT_EVIDENCES(businessId, movementId),
    {
      method: "GET",
      accessToken,
      signal,
    },
  )
}

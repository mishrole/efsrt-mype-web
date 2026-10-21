import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type { RemoveMovementEvidenceRequest } from "./interfaces"

export function removeMovementEvidence(
  businessId: string,
  movementId: string,
  evidenceId: string,
  payload: RemoveMovementEvidenceRequest,
  accessToken: string,
): Promise<void> {
  return request<void>(
    API_ROUTES.MOVEMENT_EVIDENCE_REMOVE(businessId, movementId, evidenceId),
    {
      method: "PATCH",
      body: payload,
      accessToken,
    },
  )
}

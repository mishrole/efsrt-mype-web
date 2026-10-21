import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type { OpenMovementEvidenceResponse } from "./interfaces"

export function openMovementEvidence(
  businessId: string,
  movementId: string,
  evidenceId: string,
  accessToken: string,
): Promise<OpenMovementEvidenceResponse> {
  return request<OpenMovementEvidenceResponse>(
    API_ROUTES.MOVEMENT_EVIDENCE_CONTENT(businessId, movementId, evidenceId),
    {
      method: "GET",
      accessToken,
    },
  )
}

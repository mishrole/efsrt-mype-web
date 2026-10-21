import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import { createEvidenceFormData } from "../evidence-form-data"
import type {
  ReplaceMovementEvidenceRequest,
  ReplaceMovementEvidenceResponse,
} from "./interfaces"

export function replaceMovementEvidence(
  businessId: string,
  movementId: string,
  evidenceId: string,
  payload: ReplaceMovementEvidenceRequest,
  accessToken: string,
): Promise<ReplaceMovementEvidenceResponse> {
  return request<ReplaceMovementEvidenceResponse>(
    API_ROUTES.MOVEMENT_EVIDENCE_DETAIL(businessId, movementId, evidenceId),
    {
      method: "PUT",
      body: createEvidenceFormData(payload),
      accessToken,
    },
  )
}

import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import { createEvidenceFormData } from "../evidence-form-data"
import type {
  AttachMovementEvidenceRequest,
  AttachMovementEvidenceResponse,
} from "./interfaces"

export function attachMovementEvidence(
  businessId: string,
  movementId: string,
  payload: AttachMovementEvidenceRequest,
  accessToken: string,
): Promise<AttachMovementEvidenceResponse> {
  return request<AttachMovementEvidenceResponse>(
    API_ROUTES.MOVEMENT_EVIDENCES(businessId, movementId),
    {
      method: "POST",
      body: createEvidenceFormData(payload),
      accessToken,
    },
  )
}

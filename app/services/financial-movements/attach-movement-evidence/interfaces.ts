import type { MovementEvidenceResponse } from "../evidence-interfaces"
export interface AttachMovementEvidenceRequest {
  file: File
  movementVersion: number
}
export type AttachMovementEvidenceResponse = MovementEvidenceResponse

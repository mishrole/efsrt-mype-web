import type { MovementEvidenceResponse } from "../evidence-interfaces"
export interface ReplaceMovementEvidenceRequest {
  file: File
  movementVersion: number
  evidenceVersion: number
}
export type ReplaceMovementEvidenceResponse = MovementEvidenceResponse

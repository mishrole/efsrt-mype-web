import type { MovementEvidenceResponse } from "~/services/financial-movements/evidence-interfaces"
export interface MovementEvidenceCardProps {
  evidence: MovementEvidenceResponse
  isBusy: boolean
  onOpen: (evidence: MovementEvidenceResponse) => void
  onReplace: (evidence: MovementEvidenceResponse) => void
  onRemove: (evidence: MovementEvidenceResponse) => void
}

import type { MovementEvidenceResponse } from "~/services/financial-movements/evidence-interfaces"
export interface MovementEvidenceModalProps {
  isOpen: boolean
  evidence: MovementEvidenceResponse | null
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (file: File) => Promise<void>
}

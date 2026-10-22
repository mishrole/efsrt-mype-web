import type { FinancialMovementHistoryEvidenceResponse } from "~/services/financial-movements/get-financial-movement-history-detail/interfaces"

export interface MovementHistoryDetailEvidencesProps {
  evidences: FinancialMovementHistoryEvidenceResponse[]
  openingEvidenceId: string | null
  error: string
  onOpenEvidence: (evidenceId: string) => Promise<void>
}

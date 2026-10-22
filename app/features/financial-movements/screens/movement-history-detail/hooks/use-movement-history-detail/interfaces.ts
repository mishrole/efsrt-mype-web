import type { FinancialMovementHistoryDetailResponse } from "~/services/financial-movements/get-financial-movement-history-detail/interfaces"

export interface UseMovementHistoryDetailResult {
  movement: FinancialMovementHistoryDetailResponse | null
  isLoading: boolean
  error: string
  evidenceError: string
  openingEvidenceId: string | null
  openEvidence: (evidenceId: string) => Promise<void>
  returnToHistory: () => void
}

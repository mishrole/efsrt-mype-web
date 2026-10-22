import { FinancialMovementStatus } from "~/services/financial-movements/list-financial-movement-history/interfaces"

export function getMovementStatusLabel(
  status: FinancialMovementStatus,
): string {
  switch (status) {
    case FinancialMovementStatus.Draft:
      return "Borrador"
    case FinancialMovementStatus.Confirmed:
      return "Confirmado"
    case FinancialMovementStatus.Cancelled:
      return "Anulado"
    case FinancialMovementStatus.Discarded:
      return "Descartado"
  }
}

export function getMovementStatusClasses(
  status: FinancialMovementStatus,
): string {
  switch (status) {
    case FinancialMovementStatus.Confirmed:
      return "bg-[#eaf8f0] text-[#197044]"
    case FinancialMovementStatus.Cancelled:
      return "bg-[#fff0f2] text-[#a62a43]"
    case FinancialMovementStatus.Discarded:
      return "bg-[#f1f3f7] text-[#596579]"
    default:
      return "bg-[#eef4ff] text-[#2b5fce]"
  }
}

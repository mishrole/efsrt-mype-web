import { FinancialDashboardGranularity } from "../../../../../../services/financial-dashboard/get-financial-dashboard/interfaces"

export const GRANULARITY_LABELS: Record<FinancialDashboardGranularity, string> =
  {
    [FinancialDashboardGranularity.Auto]: "Automática",
    [FinancialDashboardGranularity.Day]: "Diaria",
    [FinancialDashboardGranularity.Week]: "Semanal",
    [FinancialDashboardGranularity.Month]: "Mensual",
    [FinancialDashboardGranularity.Year]: "Anual",
  }

export const GRANULARITY_OPTIONS = Object.entries(GRANULARITY_LABELS).map(
  ([value, label]) => ({ value, label }),
)

export const CLASSNAMES = {
  labelClassName: "grid gap-[5px]",
  captionClassName: "text-[0.68rem] font-extrabold text-[#748096] uppercase",
  controlClassName:
    "min-h-10 rounded-[10px] border border-[#d9e0ec] bg-white px-[11px] py-0 text-[#2a3852]",
} as const

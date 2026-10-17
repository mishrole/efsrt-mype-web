import type { FinancialDashboardResponse } from "~/services/financial-dashboard/get-financial-dashboard/interfaces"

export const buildMetrics = (dashboard: FinancialDashboardResponse) => {
  return [
    ["Saldo de cierre", dashboard.closingBalance, "primary"],
    ["Ingresos", dashboard.cashInflow, "positive"],
    ["Egresos", dashboard.cashOutflow, "negative"],
    [
      "Flujo neto",
      dashboard.netCashFlow,
      dashboard.netCashFlow >= 0 ? "positive" : "negative",
    ],
    ["Margen bruto estimado", dashboard.estimatedGrossMargin, "standard"],
    ["Venta promedio", dashboard.averageSaleAmount, "standard"],
  ] as const
}

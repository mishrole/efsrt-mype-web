import type { FinancialTrendPoint } from "../../../../../../services/financial-dashboard/get-financial-dashboard/interfaces"

export interface CashFlowChartPoint extends FinancialTrendPoint {
  periodLabel: string
}

export function createCashFlowChartData(
  trend: FinancialTrendPoint[],
): CashFlowChartPoint[] {
  return trend.map((point) => ({
    ...point,
    periodLabel: formatPeriodLabel(point.dateFrom, point.dateTo),
  }))
}

export function formatCurrency(value: number, currencyCode: string): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatCompactCurrency(
  value: number,
  currencyCode: string,
): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currencyCode,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

export function calculateXAxisInterval(pointCount: number): number {
  if (pointCount <= 7) {
    return 0
  }

  if (pointCount <= 14) {
    return 1
  }

  return Math.ceil(pointCount / 7) - 1
}

function formatPeriodLabel(dateFrom: string, dateTo: string): string {
  const start = formatDate(dateFrom)

  if (dateFrom === dateTo) {
    return start
  }

  return `${start} - ${formatDate(dateTo)}`
}

function formatDate(value: string): string {
  const [year, month, day] = value.split("-")

  if (!year || !month || !day) {
    return value
  }

  return `${day}/${month}`
}

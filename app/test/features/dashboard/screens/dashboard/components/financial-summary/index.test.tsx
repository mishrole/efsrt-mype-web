import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { FinancialSummary } from "../../../../../../../features/dashboard/screens/dashboard/components/financial-summary"
import { FinancialDashboardGranularity } from "../../../../../../../services/financial-dashboard/get-financial-dashboard/interfaces"

const dashboard = {
  businessId: "business-id",
  currencyCode: "PEN",
  dateFrom: "2026-10-01",
  dateTo: "2026-10-16",
  granularity: FinancialDashboardGranularity.Day,
  openingBalance: 1000,
  cashInflow: 600,
  cashOutflow: 250,
  netCashFlow: 350,
  closingBalance: 1350,
  estimatedCost: 200,
  estimatedGrossMargin: 400,
  confirmedSaleCount: 2,
  confirmedExpenseCount: 1,
  averageSaleAmount: 300,
  trend: [],
  saleByCategory: [],
  expenseByCategory: [],
}

describe("FinancialSummary", () => {
  it("renders the six financial metrics using the business currency", () => {
    render(<FinancialSummary dashboard={dashboard} />)

    const summary = screen.getByRole("region", { name: "Resumen financiero" })

    expect(within(summary).getByText("Saldo de cierre")).toBeInTheDocument()
    expect(within(summary).getByText("Ingresos")).toBeInTheDocument()
    expect(within(summary).getByText("Egresos")).toBeInTheDocument()
    expect(within(summary).getByText("Flujo neto")).toBeInTheDocument()
    expect(
      within(summary).getByText("Margen bruto estimado"),
    ).toBeInTheDocument()
    expect(within(summary).getByText("Venta promedio")).toBeInTheDocument()
    expect(within(summary).getAllByText(/S\/\s?1,350\.00/)).toHaveLength(1)
  })
})

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { PeriodFilters } from "../../../../../../../features/dashboard/screens/dashboard/components/period-filters"
import { FinancialDashboardGranularity } from "../../../../../../../services/financial-dashboard/get-financial-dashboard/interfaces"

describe("PeriodFilters", () => {
  it("emits the selected start date, end date and granularity", () => {
    const onChange = vi.fn()
    const values = {
      dateFrom: "2026-10-01",
      dateTo: "2026-10-16",
      granularity: FinancialDashboardGranularity.Auto,
    }

    const { rerender } = render(
      <PeriodFilters values={values} onChange={onChange} />,
    )

    fireEvent.change(screen.getByLabelText("Desde"), {
      target: { value: "2026-10-02" },
    })

    expect(onChange).toHaveBeenLastCalledWith({
      ...values,
      dateFrom: "2026-10-02",
    })

    const changedDates = { ...values, dateFrom: "2026-10-02" }
    rerender(<PeriodFilters values={changedDates} onChange={onChange} />)

    fireEvent.change(screen.getByLabelText("Hasta"), {
      target: { value: "2026-10-20" },
    })

    expect(onChange).toHaveBeenLastCalledWith({
      ...changedDates,
      dateTo: "2026-10-20",
    })

    fireEvent.change(screen.getByLabelText("Agrupación"), {
      target: { value: String(FinancialDashboardGranularity.Month) },
    })

    expect(onChange).toHaveBeenLastCalledWith({
      ...changedDates,
      granularity: FinancialDashboardGranularity.Month,
    })
  })
})

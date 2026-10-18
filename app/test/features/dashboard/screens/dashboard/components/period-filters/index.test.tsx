import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { PeriodFilters } from "../../../../../../../features/dashboard/screens/dashboard/components/period-filters"
import { FinancialDashboardGranularity } from "../../../../../../../services/financial-dashboard/get-financial-dashboard/interfaces"

describe("PeriodFilters", () => {
  it("emits the selected start date, end date and granularity", () => {
    const onChange = vi.fn()

    const initialValues = {
      dateFrom: "2026-10-01",
      dateTo: "2026-10-16",
      granularity: FinancialDashboardGranularity.Auto,
    }

    const { rerender } = render(
      <PeriodFilters values={initialValues} onChange={onChange} />,
    )

    fireEvent.change(screen.getByLabelText("Desde"), {
      target: {
        value: "2026-10-02",
      },
    })

    const valuesWithUpdatedStartDate = {
      ...initialValues,
      dateFrom: "2026-10-02",
    }

    expect(onChange).toHaveBeenLastCalledWith(valuesWithUpdatedStartDate)

    rerender(
      <PeriodFilters values={valuesWithUpdatedStartDate} onChange={onChange} />,
    )

    fireEvent.change(screen.getByLabelText("Hasta"), {
      target: {
        value: "2026-10-20",
      },
    })

    const valuesWithUpdatedDates = {
      ...valuesWithUpdatedStartDate,
      dateTo: "2026-10-20",
    }

    expect(onChange).toHaveBeenLastCalledWith(valuesWithUpdatedDates)

    rerender(
      <PeriodFilters values={valuesWithUpdatedDates} onChange={onChange} />,
    )

    fireEvent.click(
      screen.getByRole("combobox", {
        name: "Agrupación",
      }),
    )

    const monthOption = screen.getByRole("option", {
      name: "Mes",
    })

    fireEvent.pointerDown(monthOption)
    fireEvent.click(monthOption)

    expect(onChange).toHaveBeenLastCalledWith({
      ...valuesWithUpdatedDates,
      granularity: FinancialDashboardGranularity.Month,
    })
  })
})

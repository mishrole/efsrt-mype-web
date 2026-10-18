import { fireEvent, render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { PeriodFilters } from "~/features/dashboard/screens/dashboard/components/period-filters"
import {
  GRANULARITY_LABELS,
  GRANULARITY_OPTIONS,
} from "~/features/dashboard/screens/dashboard/components/period-filters/constants"
import { FinancialDashboardGranularity } from "~/services/financial-dashboard/get-financial-dashboard/interfaces"

const INITIAL_VALUES = {
  dateFrom: "2026-10-01",
  dateTo: "2026-10-16",
  granularity: FinancialDashboardGranularity.Auto,
}

function selectCalendarDate(date: string): void {
  const dayButton = document.querySelector(
    `button[data-day="${date}"], [data-day="${date}"] button`,
  )

  if (!(dayButton instanceof HTMLElement)) {
    throw new Error(`Calendar day ${date} was not found`)
  }

  fireEvent.click(dayButton)
}

function selectGranularity(label: string): void {
  fireEvent.click(screen.getByLabelText("Agrupación"))

  const listbox = screen.getByRole("listbox")
  const option = within(listbox).getByText(label)

  fireEvent.pointerDown(option)
  fireEvent.click(option)
}

describe("PeriodFilters", () => {
  it("renders the current dates and selected granularity", () => {
    render(<PeriodFilters values={INITIAL_VALUES} onChange={vi.fn()} />)

    expect(screen.getByLabelText("Desde")).toHaveTextContent("01/10/2026")

    expect(screen.getByLabelText("Hasta")).toHaveTextContent("16/10/2026")

    expect(screen.getByLabelText("Agrupación")).toHaveTextContent(
      GRANULARITY_LABELS[FinancialDashboardGranularity.Auto],
    )
  })

  it("emits the selected start date", () => {
    const onChange = vi.fn()

    render(<PeriodFilters values={INITIAL_VALUES} onChange={onChange} />)

    fireEvent.click(screen.getByLabelText("Desde"))
    selectCalendarDate("2026-10-02")

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith({
      ...INITIAL_VALUES,
      dateFrom: "2026-10-02",
    })
  })

  it("emits the selected end date", () => {
    const onChange = vi.fn()

    render(<PeriodFilters values={INITIAL_VALUES} onChange={onChange} />)

    fireEvent.click(screen.getByLabelText("Hasta"))
    selectCalendarDate("2026-10-20")

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith({
      ...INITIAL_VALUES,
      dateTo: "2026-10-20",
    })
  })

  it.each([
    [
      FinancialDashboardGranularity.Day,
      GRANULARITY_LABELS[FinancialDashboardGranularity.Day],
    ],
    [
      FinancialDashboardGranularity.Week,
      GRANULARITY_LABELS[FinancialDashboardGranularity.Week],
    ],
    [
      FinancialDashboardGranularity.Month,
      GRANULARITY_LABELS[FinancialDashboardGranularity.Month],
    ],
    [
      FinancialDashboardGranularity.Year,
      GRANULARITY_LABELS[FinancialDashboardGranularity.Year],
    ],
  ])("emits granularity %s when selecting %s", (granularity, label) => {
    const onChange = vi.fn()

    render(<PeriodFilters values={INITIAL_VALUES} onChange={onChange} />)

    selectGranularity(label)

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith({
      ...INITIAL_VALUES,
      granularity,
    })
  })

  it("renders the label for every supported granularity", () => {
    render(<PeriodFilters values={INITIAL_VALUES} onChange={vi.fn()} />)

    fireEvent.click(screen.getByLabelText("Agrupación"))

    const listbox = screen.getByRole("listbox")

    for (const option of GRANULARITY_OPTIONS) {
      expect(within(listbox).getByText(option.label)).toBeInTheDocument()
    }
  })

  it("defines one option for every supported granularity", () => {
    expect(GRANULARITY_OPTIONS).toEqual([
      {
        value: String(FinancialDashboardGranularity.Auto),
        label: "Automática",
      },
      {
        value: String(FinancialDashboardGranularity.Day),
        label: "Diaria",
      },
      {
        value: String(FinancialDashboardGranularity.Week),
        label: "Semanal",
      },
      {
        value: String(FinancialDashboardGranularity.Month),
        label: "Mensual",
      },
      {
        value: String(FinancialDashboardGranularity.Year),
        label: "Anual",
      },
    ])
  })
})

import { render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"
import { CashFlowChart } from "~/features/dashboard/screens/dashboard/components/cash-flow-chart"

const rechartsCallbacks = vi.hoisted(() => ({
  tooltipFormatter: undefined as
    ((value: number | undefined) => string) | undefined,
  leftAxisFormatter: undefined as ((value: number) => string) | undefined,
  rightAxisFormatter: undefined as ((value: number) => string) | undefined,
}))

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  ComposedChart: ({
    children,
    data,
  }: {
    children: ReactNode
    data: unknown[]
  }) => (
    <div data-testid="cash-flow-chart" data-point-count={data.length}>
      {children}
    </div>
  ),
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: ({
    orientation,
    tickFormatter,
  }: {
    orientation?: "left" | "right"
    tickFormatter: (value: number) => string
  }) => {
    if (orientation === "right") {
      rechartsCallbacks.rightAxisFormatter = tickFormatter
    } else {
      rechartsCallbacks.leftAxisFormatter = tickFormatter
    }

    return null
  },
  Tooltip: ({
    formatter,
  }: {
    formatter: (value: number | undefined) => string
  }) => {
    rechartsCallbacks.tooltipFormatter = formatter

    return null
  },
  Legend: () => null,
  Bar: ({ name }: { name: string }) => <div>{name}</div>,
  Line: ({ name }: { name: string }) => <div>{name}</div>,
}))

const trend = [
  {
    dateFrom: "2026-10-16",
    dateTo: "2026-10-16",
    cashInflow: 100,
    cashOutflow: 20,
    netCashFlow: 80,
    closingBalance: 1080,
  },
]

describe("CashFlowChart", () => {
  it("renders the empty state when there are no trend points", () => {
    render(<CashFlowChart trend={[]} currencyCode="PEN" />)

    expect(
      screen.getByText("No hay información para el periodo."),
    ).toBeInTheDocument()
    expect(screen.queryByTestId("cash-flow-chart")).not.toBeInTheDocument()
  })

  it("renders all financial series when trend data exists", () => {
    render(<CashFlowChart trend={trend} currencyCode="PEN" />)

    expect(screen.getByTestId("cash-flow-chart")).toHaveAttribute(
      "data-point-count",
      "1",
    )
    expect(screen.getByText("Ingresos")).toBeInTheDocument()
    expect(screen.getByText("Egresos")).toBeInTheDocument()
    expect(screen.getByText("Saldo de cierre")).toBeInTheDocument()
  })

  it("formats tooltip values and handles an undefined value", () => {
    render(<CashFlowChart trend={trend} currencyCode="PEN" />)

    expect(rechartsCallbacks.tooltipFormatter).toBeDefined()
    expect(rechartsCallbacks.tooltipFormatter?.(undefined)).toBe("—")
    expect(rechartsCallbacks.tooltipFormatter?.(1000)).toMatch(
      /^S\/\s*1,000\.00$/,
    )
  })

  it("formats both chart axes using compact PEN currency", () => {
    render(<CashFlowChart trend={trend} currencyCode="PEN" />)

    expect(rechartsCallbacks.leftAxisFormatter).toBeDefined()
    expect(rechartsCallbacks.rightAxisFormatter).toBeDefined()
    expect(rechartsCallbacks.leftAxisFormatter?.(1000)).toMatch(
      /^S\/\s*1(?:\.0)?\s*K$/i,
    )
    expect(rechartsCallbacks.rightAxisFormatter?.(1000)).toMatch(
      /^S\/\s*1(?:\.0)?\s*K$/i,
    )
  })
})

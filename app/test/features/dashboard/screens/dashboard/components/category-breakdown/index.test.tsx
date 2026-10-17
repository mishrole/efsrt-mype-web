import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { CategoryBreakdown } from "~/features/dashboard/screens/dashboard/components/category-breakdown"

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  BarChart: ({
    children,
    data,
  }: {
    children: React.ReactNode
    data: unknown[]
  }) => (
    <div data-testid="category-chart" data-count={data.length}>
      {children}
    </div>
  ),
  CartesianGrid: () => <div>grid</div>,
  XAxis: ({ tickFormatter }: { tickFormatter: (value: number) => string }) => (
    <div>{tickFormatter(1000)}</div>
  ),
  YAxis: () => <div>y-axis</div>,
  Tooltip: ({
    formatter,
    labelFormatter,
  }: {
    formatter: (
      value?: number,
      name?: string,
      item?: { payload?: { percentage?: number } },
    ) => unknown[]
    labelFormatter: (label: unknown) => string
  }) => (
    <div>
      {String(formatter(undefined)[0])}|
      {String(formatter(1000, "amount", { payload: { percentage: 25 } })[0])}|
      {String(formatter(1000, "amount", { payload: {} })[0])}|
      {labelFormatter("Productos")}
    </div>
  ),
  Bar: ({
    children,
    shape,
  }: {
    children: React.ReactNode
    shape: (props: { index: number }) => React.ReactNode
  }) => (
    <div>
      {shape({ index: 0 })}
      {shape({ index: 1 })}
      {children}
    </div>
  ),
  Rectangle: ({ fill }: { fill: string }) => (
    <span data-testid="rectangle" data-fill={fill} />
  ),
  LabelList: ({ formatter }: { formatter: (value: unknown) => string }) => (
    <div>
      {formatter("invalid")}|{formatter(1000)}
    </div>
  ),
}))

const categories = [
  {
    categoryId: "active",
    categoryName: "Productos",
    categoryIsActive: true,
    amount: 1000,
    percentage: 75,
  },
  {
    categoryId: "inactive",
    categoryName: "Servicios",
    categoryIsActive: false,
    amount: 300,
    percentage: 25,
  },
]

describe("CategoryBreakdown", () => {
  it("renders its empty state", () => {
    render(
      <CategoryBreakdown title="Ventas" categories={[]} currencyCode="PEN" />,
    )
    expect(
      screen.getByText("Sin información en el periodo."),
    ).toBeInTheDocument()
    expect(screen.getByText("0 categorías")).toBeInTheDocument()
  })

  it("renders category bars and formatting branches", () => {
    render(
      <CategoryBreakdown
        title="Ventas"
        categories={categories}
        currencyCode="PEN"
        color="#123456"
      />,
    )

    expect(screen.getByTestId("category-chart")).toHaveAttribute(
      "data-count",
      "2",
    )
    expect(screen.getByText("2 categorías")).toBeInTheDocument()
    expect(screen.getAllByTestId("rectangle")[0]).toHaveAttribute(
      "data-fill",
      "#123456",
    )
    expect(screen.getAllByTestId("rectangle")[1]).toHaveAttribute(
      "data-fill",
      "#a8b2c3",
    )
    expect(screen.getByText(/Productos/)).toBeInTheDocument()
  })
})

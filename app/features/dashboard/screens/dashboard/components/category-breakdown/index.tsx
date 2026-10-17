import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type BarShapeProps,
} from "recharts"

import { CHART_COLORS } from "./constants"
import type { CategoryBreakdownProps } from "./interfaces"
import {
  calculateCategoryChartHeight,
  createCategoryChartData,
  formatCategoryAmount,
  formatCompactCategoryAmount,
} from "./utils"

export function CategoryBreakdown({
  title,
  categories,
  currencyCode,
  color = CHART_COLORS.defaultBar,
}: Readonly<CategoryBreakdownProps>) {
  const chartData = createCategoryChartData(categories)
  const chartHeight = calculateCategoryChartHeight(chartData.length)

  function formatXAxisValue(value: number): string {
    return formatCompactCategoryAmount(value, currencyCode)
  }

  function renderCategoryBar(props: BarShapeProps) {
    const category = chartData[props.index]

    return (
      <Rectangle
        {...props}
        fill={category?.categoryIsActive ? color : CHART_COLORS.inactivarBar}
        radius={[0, 7, 7, 0]}
      />
    )
  }

  function formatAmountLabel(value: unknown): string {
    if (typeof value !== "number") {
      return ""
    }

    return formatCompactCategoryAmount(value, currencyCode)
  }

  return (
    <section className="min-w-0 rounded-[20px] border border-[#e2e7f0] bg-white px-3 py-[18px] min-[641px]:p-[22px]">
      <header className="flex items-start justify-between gap-4 min-[641px]:items-center">
        <h2 className="m-0 text-base text-[#1c2a45]">{title}</h2>
        <span className="whitespace-nowrap text-[0.7rem] text-[#8993a5]">
          {categories.length} categorías
        </span>
      </header>

      {chartData.length === 0 ? (
        <p className="m-0 py-[50px] text-center text-[#8993a5]">
          Sin información en el periodo.
        </p>
      ) : (
        <div className="min-w-0 w-full" style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ top: 12, right: 74, bottom: 4, left: 8 }}
            >
              <CartesianGrid
                horizontal={false}
                stroke={CHART_COLORS.grid}
                strokeDasharray="4 4"
              />

              <XAxis
                axisLine={false}
                domain={[0, "dataMax"]}
                tick={{ fill: CHART_COLORS.axis, fontSize: 10 }}
                tickFormatter={formatXAxisValue}
                tickLine={false}
                type="number"
              />

              <YAxis
                axisLine={false}
                dataKey="categoryName"
                tick={{ fill: "#34415a", fontSize: 11, fontWeight: 700 }}
                tickLine={false}
                type="category"
                width={126}
              />

              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #dfe5ef",
                  borderRadius: "12px",
                  boxShadow: "0 14px 35px rgba(28, 48, 84, 0.14)",
                }}
                formatter={(value, _name, item) => {
                  if (value === undefined) {
                    return ["—", "Importe"]
                  }

                  const percentage = item.payload?.percentage
                  const percentageText =
                    typeof percentage === "number"
                      ? ` (${percentage.toFixed(2)}%)`
                      : ""

                  return [
                    `${formatCategoryAmount(Number(value), currencyCode)}${percentageText}`,
                    "Importe",
                  ]
                }}
                labelFormatter={(label) => String(label)}
                labelStyle={{ color: "#34415a", fontWeight: 700 }}
              />

              <Bar
                dataKey="amount"
                maxBarSize={24}
                name="Importe"
                shape={renderCategoryBar}
              >
                <LabelList
                  dataKey="amount"
                  fill="#34415a"
                  fontSize={10}
                  fontWeight={700}
                  formatter={formatAmountLabel}
                  position="right"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

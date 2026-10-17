import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { CHART_COLORS } from "./constants"
import type { CashFlowChartProps } from "./interfaces"
import {
  calculateXAxisInterval,
  createCashFlowChartData,
  formatCompactCurrency,
  formatCurrency,
} from "./utils"

export function CashFlowChart({
  trend,
  currencyCode,
}: Readonly<CashFlowChartProps>) {
  const chartData = createCashFlowChartData(trend)
  const xAxisInterval = calculateXAxisInterval(chartData.length)

  function formatLeftAxisValue(value: number): string {
    return formatCompactCurrency(value, currencyCode)
  }

  function formatRightAxisValue(value: number): string {
    return formatCompactCurrency(value, currencyCode)
  }

  return (
    <section
      className="min-w-0 rounded-[20px] border border-[#e2e7f0] bg-white px-3.5 py-[18px] min-[641px]:p-6"
      aria-labelledby="cash-flow-chart-title"
    >
      <header className="grid items-start gap-1.5 min-[641px]:flex min-[641px]:justify-between min-[641px]:gap-6">
        <div>
          <span className="text-[0.7rem] font-[850] tracking-[0.1em] text-[#2b5fce] uppercase">
            Tendencia
          </span>
          <h2
            className="mt-[5px] mb-0 text-[#182641]"
            id="cash-flow-chart-title"
          >
            Flujo de caja
          </h2>
        </div>

        <p className="mt-0.5 mb-0 text-[0.78rem] text-[#7c8799]">
          Ingresos, egresos y saldo de cierre
        </p>
      </header>

      {chartData.length === 0 ? (
        <p className="m-0 py-24 text-center text-[#778296]">
          No hay información para el periodo.
        </p>
      ) : (
        <div className="h-[280px] min-w-0 w-full min-[641px]:h-[340px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <ComposedChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 16, right: 8, bottom: 4, left: 0 }}
            >
              <CartesianGrid
                stroke={CHART_COLORS.grid}
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                axisLine={false}
                dataKey="periodLabel"
                interval={xAxisInterval}
                minTickGap={16}
                tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
                tickLine={false}
              />

              <YAxis
                axisLine={false}
                tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
                tickFormatter={formatLeftAxisValue}
                tickLine={false}
                width={72}
                yAxisId="movements"
              />

              <YAxis
                axisLine={false}
                orientation="right"
                tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
                tickFormatter={formatRightAxisValue}
                tickLine={false}
                width={72}
                yAxisId="balance"
              />

              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #dfe5ef",
                  borderRadius: "12px",
                  boxShadow: "0 14px 35px rgba(28, 48, 84, 0.14)",
                }}
                formatter={(value) =>
                  value === undefined
                    ? "—"
                    : formatCurrency(Number(value), currencyCode)
                }
                labelStyle={{ color: "#34415a", fontWeight: 700 }}
              />

              <Legend
                iconSize={9}
                wrapperStyle={{ color: "#657187", fontSize: "12px" }}
              />

              <Bar
                dataKey="cashInflow"
                fill={CHART_COLORS.inflow}
                maxBarSize={28}
                name="Ingresos"
                radius={[5, 5, 0, 0]}
                yAxisId="movements"
              />

              <Bar
                dataKey="cashOutflow"
                fill={CHART_COLORS.outflow}
                maxBarSize={28}
                name="Egresos"
                radius={[5, 5, 0, 0]}
                yAxisId="movements"
              />

              <Line
                activeDot={{ r: 5 }}
                dataKey="closingBalance"
                dot={false}
                name="Saldo de cierre"
                stroke={CHART_COLORS.closingBalance}
                strokeWidth={3}
                type="monotone"
                yAxisId="balance"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

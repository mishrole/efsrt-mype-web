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
import styles from "./styles.module.css"
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
    <section className={styles.card} aria-labelledby="cash-flow-chart-title">
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Tendencia</span>
          <h2 id="cash-flow-chart-title">Flujo de caja</h2>
        </div>

        <p>Ingresos, egresos y saldo de cierre</p>
      </header>

      {chartData.length === 0 ? (
        <p className={styles.empty}>No hay información para el periodo.</p>
      ) : (
        <div className={styles.chart}>
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

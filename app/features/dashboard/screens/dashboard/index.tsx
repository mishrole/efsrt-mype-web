import { useAuthSessionStore } from "../../../auth/stores/session"
import { DashboardHeader } from "../../components/dashboard-header"
import { DashboardLayout } from "../../components/dashboard-layout"
import { CashFlowChart } from "./components/cash-flow-chart"
import { CategoryBreakdown } from "./components/category-breakdown"
import { FinancialSummary } from "./components/financial-summary"
import { FirstBusinessOnboarding } from "./components/first-business-onboarding"
import { PeriodFilters } from "./components/period-filters"
import { useDashboard } from "./hooks/use-dashboard"
import styles from "./styles.module.css"

export function meta() {
  return [{ title: "Dashboard financiero | Mype" }]
}

export default function DashboardScreen() {
  const user = useAuthSessionStore((state) => state.user)
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const dashboardState = useDashboard()

  if (dashboardState.needsOnboarding && accessToken) {
    return (
      <FirstBusinessOnboarding
        accessToken={accessToken}
        onCreated={(business) =>
          dashboardState.reloadAfterCreation(business.businessId)
        }
      />
    )
  }

  const header = (
    <DashboardHeader
      businesses={dashboardState.businesses}
      currentBusinessId={dashboardState.currentBusinessId}
      displayName={user?.displayName ?? ""}
      onBusinessChange={dashboardState.selectBusiness}
      onLogout={dashboardState.logoutCurrentSession}
    />
  )

  return (
    <DashboardLayout header={header}>
      <section className={styles.heading}>
        <div>
          <span>Resumen financiero</span>
          <h1>Dashboard</h1>
          <p>Consulta el flujo de caja y el rendimiento de tu negocio</p>
        </div>
        <PeriodFilters
          values={dashboardState.filters}
          onChange={dashboardState.setFilters}
        />
      </section>

      {dashboardState.error ? (
        <div className={styles.error} role="alert">
          {dashboardState.error}
        </div>
      ) : null}

      {dashboardState.isLoading ? (
        <div className={styles.loading}>Cargando información financiera...</div>
      ) : null}

      {dashboardState.dashboard && !dashboardState.isLoading ? (
        <div className={styles.content}>
          <FinancialSummary dashboard={dashboardState.dashboard} />

          <div className={styles.insights}>
            <CashFlowChart
              trend={dashboardState.dashboard.trend}
              currencyCode={dashboardState.dashboard.currencyCode}
            />

            <div className={styles.categories}>
              <CategoryBreakdown
                title="Ventas por categoría"
                categories={dashboardState.dashboard.saleByCategory}
                currencyCode={dashboardState.dashboard.currencyCode}
                color="#3e72e8"
              />

              <CategoryBreakdown
                title="Gastos por categoría"
                categories={dashboardState.dashboard.expenseByCategory}
                currencyCode={dashboardState.dashboard.currencyCode}
                color="#e8795e"
              />
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  )
}

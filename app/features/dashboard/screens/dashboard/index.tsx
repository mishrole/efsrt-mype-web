import { PackageIcon, TagIcon } from "lucide-react"
import { useNavigate } from "react-router"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import { FullScreenLoading } from "~/shared/components/full-screen-loading"
import type { UserMenuShortcut } from "~/shared/components/user-menu/interfaces"
import { APP_PATHS } from "~/shared/constants/pages"
import { useAuthSessionStore } from "../../../auth/stores/session"
import { DashboardHeader } from "../../components/dashboard-header"
import { DashboardLayout } from "../../components/dashboard-layout"
import { CashFlowChart } from "./components/cash-flow-chart"
import { CategoryBreakdown } from "./components/category-breakdown"
import { FinancialSummary } from "./components/financial-summary"
import { FirstBusinessOnboarding } from "./components/first-business-onboarding"
import { PeriodFilters } from "./components/period-filters"
import { useDashboard } from "./hooks/use-dashboard"

export function meta() {
  return [{ title: "Dashboard financiero | Mype" }]
}
export default function DashboardScreen() {
  const user = useAuthSessionStore((state) => state.user)
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const storedPermissions =
    useBusinessContextStore((state) => state.context?.permissions) ?? []
  const dashboardState = useDashboard()
  const navigate = useNavigate()

  function navigateToProducts(): void {
    void navigate(APP_PATHS.PRODUCTS)
  }

  function navigateToProductCategories(): void {
    void navigate(APP_PATHS.PRODUCT_CATEGORIES)
  }

  const userMenuShortcuts: UserMenuShortcut[] = [
    {
      id: "products",
      label: "Productos",
      icon: <PackageIcon aria-hidden="true" />,
      onSelect: navigateToProducts,
      disabled: !storedPermissions.includes("PRODUCT_READ"),
    },
    {
      id: "product-categories",
      label: "Categorías",
      icon: <TagIcon aria-hidden="true" />,
      onSelect: navigateToProductCategories,
      disabled: !storedPermissions.includes("PRODUCT_CATEGORY_READ"),
    },
  ]

  if (dashboardState.needsOnboarding && accessToken)
    return (
      <FirstBusinessOnboarding
        accessToken={accessToken}
        onCreated={(business) =>
          dashboardState.reloadAfterCreation(business.businessId)
        }
      />
    )
  const header = (
    <DashboardHeader
      businesses={dashboardState.businesses}
      currentBusinessId={dashboardState.currentBusinessId}
      user={user}
      permissions={storedPermissions}
      shortcuts={userMenuShortcuts}
      onBusinessChange={dashboardState.selectBusiness}
      onLogout={dashboardState.logoutCurrentSession}
    />
  )
  return (
    <DashboardLayout header={header}>
      <section className="mb-[25px] flex flex-col items-stretch gap-[30px] min-[761px]:flex-row min-[761px]:items-end min-[761px]:justify-between">
        <div>
          <span className="text-[0.72rem] font-[850] tracking-[0.1em] text-[#2b5fce] uppercase">
            Resumen financiero
          </span>
          <h1 className="my-1.5 text-[clamp(2rem,4vw,3.2rem)] tracking-[-0.045em] text-[#15233e]">
            Dashboard
          </h1>
          <p className="m-0 text-[#788398]">
            Consulta el flujo de caja y el rendimiento de tu negocio
          </p>
        </div>
        <PeriodFilters
          values={dashboardState.filters}
          onChange={dashboardState.setFilters}
        />
      </section>
      {dashboardState.error ? (
        <div
          className="rounded-2xl border border-[#efc2c8] bg-[#fff4f5] p-[50px] text-center text-[#9f2137]"
          role="alert"
        >
          {dashboardState.error}
        </div>
      ) : null}
      {dashboardState.isLoading ? (
        <FullScreenLoading
          overlay
          message="Cargando información financiera..."
        />
      ) : null}
      {dashboardState.dashboard && !dashboardState.isLoading ? (
        <div className="grid gap-[18px]">
          <FinancialSummary dashboard={dashboardState.dashboard} />
          <div className="grid grid-cols-1 gap-[18px] min-[1001px]:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.75fr)]">
            <CashFlowChart
              trend={dashboardState.dashboard.trend}
              currencyCode={dashboardState.dashboard.currencyCode}
            />
            <div className="grid grid-cols-1 gap-[18px] min-[761px]:grid-cols-2 min-[1001px]:grid-cols-1">
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

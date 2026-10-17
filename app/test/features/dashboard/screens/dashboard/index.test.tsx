import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import DashboardScreen, { meta } from "~/features/dashboard/screens/dashboard"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useDashboard } from "~/features/dashboard/screens/dashboard/hooks/use-dashboard"
import { FinancialDashboardGranularity } from "~/services/financial-dashboard/get-financial-dashboard/interfaces"

vi.mock("~/features/dashboard/screens/dashboard/hooks/use-dashboard", () => ({
  useDashboard: vi.fn(),
}))
vi.mock(
  "~/features/dashboard/screens/dashboard/components/cash-flow-chart",
  () => ({ CashFlowChart: () => <div>Cash flow chart</div> }),
)
vi.mock(
  "~/features/dashboard/screens/dashboard/components/category-breakdown",
  () => ({
    CategoryBreakdown: ({ title }: { title: string }) => <div>{title}</div>,
  }),
)
vi.mock(
  "~/features/dashboard/screens/dashboard/components/financial-summary",
  () => ({ FinancialSummary: () => <div>Financial summary</div> }),
)
vi.mock(
  "~/features/dashboard/screens/dashboard/components/first-business-onboarding",
  () => ({
    FirstBusinessOnboarding: ({
      onCreated,
    }: {
      onCreated: (business: { businessId: string }) => Promise<void>
    }) => (
      <button
        type="button"
        onClick={() => void onCreated({ businessId: "new-business" })}
      >
        Create first business
      </button>
    ),
  }),
)

const useDashboardMock = vi.mocked(useDashboard)
const defaultState = {
  businesses: [],
  currentBusinessId: "",
  dashboard: null,
  filters: {
    dateFrom: "",
    dateTo: "",
    granularity: FinancialDashboardGranularity.Auto,
  },
  isLoading: false,
  error: "",
  needsOnboarding: false,
  selectBusiness: vi.fn(),
  setFilters: vi.fn(),
  reloadAfterCreation: vi.fn().mockResolvedValue(undefined),
  logoutCurrentSession: vi.fn().mockResolvedValue(undefined),
}

function setSession(accessToken: string | null = "access-token"): void {
  useAuthSessionStore.setState({
    accessToken,
    tokenType: accessToken ? "Bearer" : null,
    expiresAt: accessToken ? "2026-10-16T20:00:00Z" : null,
    user: accessToken
      ? {
          id: "user-id",
          email: "user@example.com",
          displayName: "Mitchell",
          status: 1,
        }
      : null,
    isAuthenticated: Boolean(accessToken),
  })
}

describe("DashboardScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setSession()
    useDashboardMock.mockReturnValue({ ...defaultState })
  })

  it("defines the dashboard metadata", () => {
    expect(meta()).toContainEqual({ title: "Dashboard financiero | Mype" })
  })

  it("renders onboarding and reloads after business creation", () => {
    const reloadAfterCreation = vi.fn().mockResolvedValue(undefined)
    useDashboardMock.mockReturnValue({
      ...defaultState,
      needsOnboarding: true,
      reloadAfterCreation,
    })

    render(<DashboardScreen />)
    fireEvent.click(
      screen.getByRole("button", { name: "Create first business" }),
    )

    expect(reloadAfterCreation).toHaveBeenCalledWith("new-business")
  })

  it("does not render onboarding without an access token", () => {
    setSession(null)
    useDashboardMock.mockReturnValue({ ...defaultState, needsOnboarding: true })

    render(<DashboardScreen />)

    expect(
      screen.queryByRole("button", { name: "Create first business" }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument()
  })

  it("renders loading and API error states", () => {
    useDashboardMock.mockReturnValue({
      ...defaultState,
      isLoading: true,
      error: "No disponible",
    })

    render(<DashboardScreen />)

    expect(
      screen.getByText("Cargando información financiera..."),
    ).toBeInTheDocument()
    expect(screen.getByRole("alert")).toHaveTextContent("No disponible")
  })

  it("renders the complete financial dashboard", () => {
    useDashboardMock.mockReturnValue({
      ...defaultState,
      currentBusinessId: "business-id",
      businesses: [
        {
          businessId: "business-id",
          displayName: "Negocio",
          currencyCode: "PEN",
          status: 1,
          membershipId: "membership-id",
          roleCode: "OWNER",
        },
      ],
      dashboard: {
        businessId: "business-id",
        currencyCode: "PEN",
        dateFrom: "2026-10-01",
        dateTo: "2026-10-16",
        granularity: FinancialDashboardGranularity.Day,
        openingBalance: 1000,
        cashInflow: 0,
        cashOutflow: 0,
        netCashFlow: 0,
        closingBalance: 1000,
        estimatedCost: 0,
        estimatedGrossMargin: 0,
        confirmedSaleCount: 0,
        confirmedExpenseCount: 0,
        averageSaleAmount: 0,
        trend: [],
        saleByCategory: [],
        expenseByCategory: [],
      },
    })

    render(<DashboardScreen />)

    expect(screen.getByText("Financial summary")).toBeInTheDocument()
    expect(screen.getByText("Cash flow chart")).toBeInTheDocument()
    expect(screen.getByText("Ventas por categoría")).toBeInTheDocument()
    expect(screen.getByText("Gastos por categoría")).toBeInTheDocument()
    expect(screen.getByText("Mitchell")).toBeInTheDocument()
  })
})

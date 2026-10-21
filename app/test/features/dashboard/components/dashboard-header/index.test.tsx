import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { DashboardHeader } from "~/features/dashboard/components/dashboard-header"
import { APP_PATHS } from "~/shared/constants/pages"

const routerMocks = vi.hoisted(() => ({
  navigate: vi.fn(),
}))

vi.mock("react-router", async (importOriginal) => {
  const reactRouter = await importOriginal<typeof import("react-router")>()

  return {
    ...reactRouter,
    useNavigate: () => routerMocks.navigate,
  }
})

const BUSINESSES = [
  {
    businessId: "business-1",
    displayName: "Negocio uno",
    currencyCode: "PEN",
    status: 1,
    membershipId: "membership-1",
    roleCode: "OWNER",
  },
  {
    businessId: "business-2",
    displayName: "Negocio dos",
    currencyCode: "PEN",
    status: 1,
    membershipId: "membership-2",
    roleCode: "OWNER",
  },
]

const USER = {
  id: "user-1",
  displayName: "Mitchell Rodríguez",
  email: "mitchell@example.com",
  status: 1,
}

const CREATION_PERMISSIONS = ["MOVEMENT_CREATE", "PRODUCT_CREATE"]

function renderDashboardHeader(
  permissions: string[] = CREATION_PERMISSIONS,
  overrides: Partial<React.ComponentProps<typeof DashboardHeader>> = {},
): void {
  render(
    <DashboardHeader
      businesses={BUSINESSES}
      currentBusinessId="business-1"
      permissions={permissions}
      user={USER}
      onBusinessChange={vi.fn()}
      onLogout={vi.fn().mockResolvedValue(undefined)}
      {...overrides}
    />,
  )
}

function selectBusiness(businessName: string): void {
  fireEvent.click(screen.getByLabelText("Negocio"))

  const option = screen.getByText(businessName)

  fireEvent.pointerDown(option)
  fireEvent.click(option)
}

function openNewMenu(): void {
  fireEvent.click(screen.getByLabelText("Crear nuevo"))
}

function selectNewOption(optionName: string): void {
  openNewMenu()

  const option = screen.getByText(optionName)

  fireEvent.pointerDown(option)
  fireEvent.click(option)
}

describe("DashboardHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the selected business and changes to another business", () => {
    const onBusinessChange = vi.fn()

    renderDashboardHeader(CREATION_PERMISSIONS, { onBusinessChange })

    expect(screen.getByLabelText("Negocio")).toHaveTextContent("Negocio uno")

    selectBusiness("Negocio dos")

    expect(onBusinessChange).toHaveBeenCalledOnce()
    expect(onBusinessChange).toHaveBeenCalledWith("business-2")
  })

  it("navigates to sale creation from the New menu", () => {
    renderDashboardHeader()

    selectNewOption("Registrar venta")

    expect(routerMocks.navigate).toHaveBeenCalledOnce()
    expect(routerMocks.navigate).toHaveBeenCalledWith(
      APP_PATHS.FINANCIAL_MOVEMENT_CREATE("sale"),
    )
  })

  it("navigates to expense creation from the New menu", () => {
    renderDashboardHeader()

    selectNewOption("Registrar gasto")

    expect(routerMocks.navigate).toHaveBeenCalledOnce()
    expect(routerMocks.navigate).toHaveBeenCalledWith(
      APP_PATHS.FINANCIAL_MOVEMENT_CREATE("expense"),
    )
  })

  it("navigates to product creation from the New menu", () => {
    renderDashboardHeader()

    selectNewOption("Crear producto")

    expect(routerMocks.navigate).toHaveBeenCalledOnce()
    expect(routerMocks.navigate).toHaveBeenCalledWith(APP_PATHS.PRODUCT_CREATE)
  })

  it("shows only movement actions with MOVEMENT_CREATE", () => {
    renderDashboardHeader(["MOVEMENT_CREATE"])

    openNewMenu()

    expect(screen.getByText("Registrar venta")).toBeInTheDocument()
    expect(screen.getByText("Registrar gasto")).toBeInTheDocument()
    expect(screen.queryByText("Crear producto")).not.toBeInTheDocument()
  })

  it("shows only product creation with PRODUCT_CREATE", () => {
    renderDashboardHeader(["PRODUCT_CREATE"])

    openNewMenu()

    expect(screen.getByText("Crear producto")).toBeInTheDocument()
    expect(screen.queryByText("Registrar venta")).not.toBeInTheDocument()
    expect(screen.queryByText("Registrar gasto")).not.toBeInTheDocument()
  })

  it("does not render the New menu without creation permissions", () => {
    renderDashboardHeader([])

    expect(screen.queryByLabelText("Crear nuevo")).not.toBeInTheDocument()
  })

  it("renders the authenticated user and closes the session", () => {
    const onLogout = vi.fn().mockResolvedValue(undefined)

    renderDashboardHeader(CREATION_PERMISSIONS, { onLogout })

    fireEvent.click(screen.getByLabelText("Abrir menú de usuario"))

    expect(screen.getByText("Mitchell Rodríguez")).toBeInTheDocument()
    expect(screen.getByText("mitchell@example.com")).toBeInTheDocument()

    const logoutOption = screen.getByText("Cerrar sesión")

    fireEvent.pointerDown(logoutOption)
    fireEvent.click(logoutOption)

    expect(onLogout).toHaveBeenCalledOnce()
  })

  it("uses the fallback user when the session user is unavailable", () => {
    renderDashboardHeader([], { user: null })

    expect(screen.getByLabelText("Abrir menú de usuario")).toHaveTextContent(
      "U",
    )

    fireEvent.click(screen.getByLabelText("Abrir menú de usuario"))

    expect(screen.getByText("Usuario")).toBeInTheDocument()
  })

  it("renders the supplied user-menu shortcuts", () => {
    const onSelect = vi.fn()

    renderDashboardHeader([], {
      shortcuts: [
        {
          id: "products",
          label: "Productos",
          onSelect,
        },
      ],
    })

    fireEvent.click(screen.getByLabelText("Abrir menú de usuario"))

    const productsOption = screen.getByText("Productos")

    fireEvent.pointerDown(productsOption)
    fireEvent.click(productsOption)

    expect(onSelect).toHaveBeenCalledOnce()
  })
})

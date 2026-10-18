import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { DashboardHeader } from "~/features/dashboard/components/dashboard-header"

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

function closeOpenDialog(): void {
  fireEvent.click(
    screen.getByRole("button", {
      name: "Cerrar",
    }),
  )
}

describe("DashboardHeader", () => {
  it("renders the selected business and changes to another business", () => {
    const onBusinessChange = vi.fn()

    render(
      <DashboardHeader
        businesses={BUSINESSES}
        currentBusinessId="business-1"
        permissions={CREATION_PERMISSIONS}
        user={USER}
        onBusinessChange={onBusinessChange}
        onLogout={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    expect(screen.getByLabelText("Negocio")).toHaveTextContent("Negocio uno")

    selectBusiness("Negocio dos")

    expect(onBusinessChange).toHaveBeenCalledOnce()
    expect(onBusinessChange).toHaveBeenCalledWith("business-2")
  })

  it("opens the sale placeholder from the New menu and closes it", () => {
    render(
      <DashboardHeader
        businesses={BUSINESSES}
        currentBusinessId="business-1"
        permissions={CREATION_PERMISSIONS}
        user={USER}
        onBusinessChange={vi.fn()}
        onLogout={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    selectNewOption("Registrar venta")

    expect(
      screen.getByRole("dialog", {
        name: "Registrar venta",
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText("Aquí se registrará una nueva venta."),
    ).toBeInTheDocument()

    closeOpenDialog()

    expect(
      screen.queryByRole("dialog", {
        name: "Registrar venta",
      }),
    ).not.toBeInTheDocument()
  })

  it("opens the expense placeholder from the New menu and closes it", () => {
    render(
      <DashboardHeader
        businesses={BUSINESSES}
        currentBusinessId="business-1"
        permissions={CREATION_PERMISSIONS}
        user={USER}
        onBusinessChange={vi.fn()}
        onLogout={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    selectNewOption("Registrar gasto")

    expect(
      screen.getByRole("dialog", {
        name: "Registrar gasto",
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText("Aquí se registrará un nuevo gasto."),
    ).toBeInTheDocument()

    closeOpenDialog()

    expect(
      screen.queryByRole("dialog", {
        name: "Registrar gasto",
      }),
    ).not.toBeInTheDocument()
  })

  it("opens the product placeholder from the New menu and closes it", () => {
    render(
      <DashboardHeader
        businesses={BUSINESSES}
        currentBusinessId="business-1"
        permissions={CREATION_PERMISSIONS}
        user={USER}
        onBusinessChange={vi.fn()}
        onLogout={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    selectNewOption("Crear producto")

    expect(
      screen.getByRole("dialog", {
        name: "Crear producto",
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText("Aquí se registrará un nuevo producto."),
    ).toBeInTheDocument()

    closeOpenDialog()

    expect(
      screen.queryByRole("dialog", {
        name: "Crear producto",
      }),
    ).not.toBeInTheDocument()
  })

  it("shows only movement actions with MOVEMENT_CREATE", () => {
    render(
      <DashboardHeader
        businesses={BUSINESSES}
        currentBusinessId="business-1"
        permissions={["MOVEMENT_CREATE"]}
        user={USER}
        onBusinessChange={vi.fn()}
        onLogout={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    openNewMenu()

    expect(screen.getByText("Registrar venta")).toBeInTheDocument()

    expect(screen.getByText("Registrar gasto")).toBeInTheDocument()

    expect(screen.queryByText("Crear producto")).not.toBeInTheDocument()
  })

  it("shows only product creation with PRODUCT_CREATE", () => {
    render(
      <DashboardHeader
        businesses={BUSINESSES}
        currentBusinessId="business-1"
        permissions={["PRODUCT_CREATE"]}
        user={USER}
        onBusinessChange={vi.fn()}
        onLogout={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    openNewMenu()

    expect(screen.getByText("Crear producto")).toBeInTheDocument()

    expect(screen.queryByText("Registrar venta")).not.toBeInTheDocument()

    expect(screen.queryByText("Registrar gasto")).not.toBeInTheDocument()
  })

  it("does not render the New menu without creation permissions", () => {
    render(
      <DashboardHeader
        businesses={BUSINESSES}
        currentBusinessId="business-1"
        permissions={[]}
        user={USER}
        onBusinessChange={vi.fn()}
        onLogout={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    expect(screen.queryByLabelText("Crear nuevo")).not.toBeInTheDocument()
  })

  it("renders the authenticated user and closes the session", () => {
    const onLogout = vi.fn().mockResolvedValue(undefined)

    render(
      <DashboardHeader
        businesses={BUSINESSES}
        currentBusinessId="business-1"
        permissions={CREATION_PERMISSIONS}
        user={USER}
        onBusinessChange={vi.fn()}
        onLogout={onLogout}
      />,
    )

    fireEvent.click(screen.getByLabelText("Abrir menú de usuario"))

    expect(screen.getByText("Mitchell Rodríguez")).toBeInTheDocument()

    expect(screen.getByText("mitchell@example.com")).toBeInTheDocument()

    const logoutOption = screen.getByText("Cerrar sesión")

    fireEvent.pointerDown(logoutOption)
    fireEvent.click(logoutOption)

    expect(onLogout).toHaveBeenCalledOnce()
  })

  it("uses the fallback user when the session user is unavailable", () => {
    render(
      <DashboardHeader
        businesses={BUSINESSES}
        currentBusinessId="business-1"
        permissions={[]}
        user={null}
        onBusinessChange={vi.fn()}
        onLogout={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    expect(screen.getByLabelText("Abrir menú de usuario")).toHaveTextContent(
      "U",
    )

    fireEvent.click(screen.getByLabelText("Abrir menú de usuario"))

    expect(screen.getByText("Usuario")).toBeInTheDocument()
  })

  it("renders the supplied user-menu shortcuts", () => {
    const onSelect = vi.fn()

    render(
      <DashboardHeader
        businesses={BUSINESSES}
        currentBusinessId="business-1"
        permissions={[]}
        user={USER}
        shortcuts={[
          {
            id: "products",
            label: "Productos",
            onSelect,
          },
        ]}
        onBusinessChange={vi.fn()}
        onLogout={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    fireEvent.click(screen.getByLabelText("Abrir menú de usuario"))

    const productsOption = screen.getByText("Productos")

    fireEvent.pointerDown(productsOption)
    fireEvent.click(productsOption)

    expect(onSelect).toHaveBeenCalledOnce()
  })
})

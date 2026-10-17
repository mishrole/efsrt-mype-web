import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { DashboardHeader } from "../../../../../features/dashboard/components/dashboard-header"

const businesses = [
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

describe("DashboardHeader", () => {
  it("changes the selected business and closes the session", () => {
    const onBusinessChange = vi.fn()
    const onLogout = vi.fn().mockResolvedValue(undefined)

    render(
      <DashboardHeader
        businesses={businesses}
        currentBusinessId="business-1"
        user={{
          id: "user-1",
          displayName: "Mitchell Rodríguez",
          email: "mitchell@example.com",
          status: 1,
        }}
        onBusinessChange={onBusinessChange}
        onLogout={onLogout}
      />,
    )

    fireEvent.change(screen.getByLabelText("Negocio"), {
      target: { value: "business-2" },
    })

    fireEvent.click(
      screen.getByRole("button", {
        name: "Abrir menú de usuario",
      }),
    )

    expect(screen.getByText("Mitchell Rodríguez")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }))

    expect(onBusinessChange).toHaveBeenCalledWith("business-2")
    expect(onLogout).toHaveBeenCalledOnce()
  })

  it("uses the fallback user and opens and closes the movement modal", () => {
    render(
      <DashboardHeader
        businesses={businesses}
        currentBusinessId="business-1"
        user={null}
        onBusinessChange={vi.fn()}
        onLogout={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    expect(
      screen.getByRole("button", { name: "Abrir menú de usuario" }),
    ).toHaveTextContent("U")
    fireEvent.click(
      screen.getByRole("button", { name: "Registrar movimiento" }),
    )
    expect(
      screen.getByRole("dialog", { name: "Registrar movimiento" }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }))
    expect(
      screen.queryByRole("dialog", { name: "Registrar movimiento" }),
    ).not.toBeInTheDocument()
  })
})

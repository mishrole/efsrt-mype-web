import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { UserMenu } from "~/shared/components/user-menu"

const defaultProps = {
  displayName: "Mitchell Rodríguez",
  email: "mitchell@example.com",
  shortcuts: [],
  onOpenChange: vi.fn(),
  onLogout: vi.fn().mockResolvedValue(undefined),
}

describe("UserMenu", () => {
  it("renders the trigger without rendering the menu while closed", () => {
    render(<UserMenu {...defaultProps} open={false} />)

    expect(
      screen.getByRole("button", { name: "Abrir menú de usuario" }),
    ).toHaveTextContent("MR")
    expect(screen.queryByText("Mitchell Rodríguez")).not.toBeInTheDocument()
  })

  it("renders the empty state and requests closing from the close button", () => {
    const onOpenChange = vi.fn()
    render(<UserMenu {...defaultProps} open onOpenChange={onOpenChange} />)

    expect(
      screen.getByText("Los próximos módulos aparecerán aquí."),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Cerrar menú" }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("selects shortcuts and closes the menu", () => {
    const onOpenChange = vi.fn()
    const onSelect = vi.fn()

    render(
      <UserMenu
        {...defaultProps}
        open
        onOpenChange={onOpenChange}
        shortcuts={[
          { id: "sales", label: "Ventas", onSelect },
          {
            id: "disabled",
            label: "Deshabilitado",
            onSelect: vi.fn(),
            disabled: true,
          },
        ]}
      />,
    )

    fireEvent.click(screen.getByRole("menuitem", { name: /Ventas/ }))

    expect(onSelect).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(
      screen.getByRole("menuitem", { name: /Deshabilitado/ }),
    ).toHaveAttribute("aria-disabled", "true")
  })

  it("closes the menu and logs out", () => {
    const onOpenChange = vi.fn()
    const onLogout = vi.fn().mockResolvedValue(undefined)

    render(
      <UserMenu
        {...defaultProps}
        open
        onOpenChange={onOpenChange}
        onLogout={onLogout}
      />,
    )
    fireEvent.click(screen.getByRole("menuitem", { name: "Cerrar sesión" }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onLogout).toHaveBeenCalledOnce()
  })
})

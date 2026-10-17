import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { UserMenu } from "~/shared/components/user-menu"

const defaultProps = {
  displayName: "Mitchell Rodríguez",
  email: "mitchell@example.com",
  shortcuts: [],
  onClose: vi.fn(),
  onLogout: vi.fn().mockResolvedValue(undefined),
}

describe("UserMenu", () => {
  it("does not render while closed", () => {
    render(<UserMenu {...defaultProps} open={false} />)

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("renders the empty state and handles Escape and the close button", () => {
    const onClose = vi.fn()
    render(<UserMenu {...defaultProps} open onClose={onClose} />)

    expect(screen.getByText("Los próximos módulos aparecerán aquí.")).toBeInTheDocument()

    fireEvent.keyDown(document, { key: "Enter" })
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.keyDown(document, { key: "Escape" })
    fireEvent.click(screen.getByRole("button", { name: "Cerrar menú" }))

    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it("handles outside clicks, shortcuts and logout without closing from inside clicks", () => {
    const onClose = vi.fn()
    const onLogout = vi.fn().mockResolvedValue(undefined)
    const onSelect = vi.fn()

    render(
      <UserMenu
        {...defaultProps}
        open
        onClose={onClose}
        onLogout={onLogout}
        shortcuts={[
          { id: "sales", label: "Ventas", onSelect },
          { id: "disabled", label: "Deshabilitado", onSelect: vi.fn(), disabled: true },
        ]}
      />,
    )

    fireEvent.pointerDown(screen.getByRole("dialog"))
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole("button", { name: "Ventas" }))
    fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }))
    fireEvent.pointerDown(document.body)

    expect(onSelect).toHaveBeenCalledOnce()
    expect(onLogout).toHaveBeenCalledOnce()
    expect(onClose).toHaveBeenCalledOnce()
  })
})

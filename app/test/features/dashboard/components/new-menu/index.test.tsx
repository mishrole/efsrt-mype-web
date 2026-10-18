import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { NewMenu } from "~/features/dashboard/components/new-menu"

describe("NewMenu", () => {
  it("does not render without creation permissions", () => {
    render(
      <NewMenu
        canCreateMovement={false}
        canCreateProduct={false}
        onCreateSale={vi.fn()}
        onCreateExpense={vi.fn()}
        onCreateProduct={vi.fn()}
      />,
    )
    expect(screen.queryByLabelText("Crear nuevo")).not.toBeInTheDocument()
  })

  it("shows permitted shortcuts and triggers their actions", () => {
    const onCreateSale = vi.fn()
    const onCreateExpense = vi.fn()
    const onCreateProduct = vi.fn()
    render(
      <NewMenu
        canCreateMovement
        canCreateProduct
        onCreateSale={onCreateSale}
        onCreateExpense={onCreateExpense}
        onCreateProduct={onCreateProduct}
      />,
    )

    fireEvent.click(screen.getByLabelText("Crear nuevo"))
    fireEvent.click(screen.getByText("Registrar venta"))
    expect(onCreateSale).toHaveBeenCalledOnce()

    fireEvent.click(screen.getByLabelText("Crear nuevo"))
    fireEvent.click(screen.getByText("Registrar gasto"))
    expect(onCreateExpense).toHaveBeenCalledOnce()

    fireEvent.click(screen.getByLabelText("Crear nuevo"))
    fireEvent.click(screen.getByText("Crear producto"))
    expect(onCreateProduct).toHaveBeenCalledOnce()
  })
})

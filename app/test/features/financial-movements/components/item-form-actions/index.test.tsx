import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ItemFormActions } from "~/features/financial-movements/components/item-form-actions"

describe("ItemFormActions", () => {
  it("uses the create label and dispatches cancel", () => {
    const onCancel = vi.fn()
    render(
      <ItemFormActions
        isEditing={false}
        isSubmitting={false}
        createLabel="Agregar producto"
        onCancel={onCancel}
      />,
    )
    expect(
      screen.getByRole("button", { name: "Agregar producto" }),
    ).toBeEnabled()
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it("uses the edit label", () => {
    render(
      <ItemFormActions
        isEditing
        isSubmitting={false}
        createLabel="Agregar concepto"
        onCancel={vi.fn()}
      />,
    )
    expect(
      screen.getByRole("button", { name: "Guardar cambios" }),
    ).toBeInTheDocument()
  })

  it("uses the submitting label and disables submission", () => {
    render(
      <ItemFormActions
        isEditing={false}
        isSubmitting
        createLabel="Agregar producto"
        onCancel={vi.fn()}
      />,
    )
    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled()
  })
})

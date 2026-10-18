import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Modal } from "~/shared/components/modal"

describe("Modal", () => {
  it("does not render when it is closed", () => {
    render(
      <Modal open={false} title="Detalle" onClose={vi.fn()}>
        Contenido
      </Modal>,
    )

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("renders optional content and closes with Escape or the close button", () => {
    const onClose = vi.fn()

    render(
      <Modal
        open
        title="Detalle"
        description="Descripción"
        footer={<button type="button">Aceptar</button>}
        closeLabel="Cerrar detalle"
        onClose={onClose}
      >
        Contenido
      </Modal>,
    )

    const dialog = screen.getByRole("dialog", { name: "Detalle" })
    expect(dialog).toHaveAccessibleDescription("Descripción")
    expect(screen.getByText("Contenido")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Aceptar" })).toBeInTheDocument()

    fireEvent.keyDown(document, { key: "Enter" })
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.keyDown(document, { key: "Escape" })
    expect(onClose).toHaveBeenCalledOnce()

    fireEvent.click(screen.getByRole("button", { name: "Cerrar detalle" }))
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it("renders without optional content and uses the default close label", () => {
    const onClose = vi.fn()

    render(
      <Modal open title="Detalle" onClose={onClose}>
        Contenido
      </Modal>,
    )

    const dialog = screen.getByRole("dialog", { name: "Detalle" })
    expect(dialog).not.toHaveAccessibleDescription()
    expect(screen.queryByText("Descripción")).not.toBeInTheDocument()
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})

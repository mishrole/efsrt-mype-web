import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Modal } from "~/shared/components/modal"

describe("Modal", () => {
  afterEach(() => {
    document.body.style.overflow = ""
  })

  it("does not render when it is closed", () => {
    render(
      <Modal open={false} title="Detalle" onClose={vi.fn()}>
        Contenido
      </Modal>,
    )

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("renders its optional content and closes from every supported action", () => {
    const onClose = vi.fn()
    document.body.style.overflow = "auto"

    const { unmount } = render(
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
    expect(document.body.style.overflow).toBe("hidden")

    fireEvent.mouseDown(dialog)
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.keyDown(document, { key: "Enter" })
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.keyDown(document, { key: "Escape" })
    fireEvent.click(screen.getByRole("button", { name: "Cerrar detalle" }))
    fireEvent.mouseDown(dialog.parentElement as HTMLElement)

    expect(onClose).toHaveBeenCalledTimes(3)

    unmount()
    expect(document.body.style.overflow).toBe("auto")
  })

  it("renders without optional content and uses the default close label", () => {
    const onClose = vi.fn()

    render(
      <Modal open title="Detalle" onClose={onClose}>
        Contenido
      </Modal>,
    )

    const dialog = screen.getByRole("dialog", { name: "Detalle" })

    expect(dialog).not.toHaveAttribute("aria-describedby")
    expect(screen.queryByText("Descripción")).not.toBeInTheDocument()
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }))

    expect(onClose).toHaveBeenCalledOnce()
  })
})

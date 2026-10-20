import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FinancialMovementForm } from "~/features/financial-movements/components/financial-movement-form"
import { FINANCIAL_MOVEMENT_TYPES } from "~/features/financial-movements/constants"

describe("FinancialMovementForm", () => {
  it("submits a sale with default current date", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-10-19T15:00:00-05:00"))
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <FinancialMovementForm
        type={FINANCIAL_MOVEMENT_TYPES.sale}
        isSubmitting={false}
        submitLabel="Crear borrador"
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    )
    expect(screen.getByText("Venta")).toBeInTheDocument()
    expect(screen.getByLabelText("Fecha")).toHaveValue("2026-10-19")
    fireEvent.change(screen.getByLabelText("Descripción opcional"), {
      target: { value: "Venta" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Crear borrador" }))
    await vi.runAllTimersAsync()
    expect(onSubmit).toHaveBeenCalledWith(
      { movementDate: "2026-10-19", description: "Venta" },
      expect.anything(),
    )
    vi.useRealTimers()
  })

  it("renders expense values and cancels", () => {
    const onCancel = vi.fn()
    render(
      <FinancialMovementForm
        type={FINANCIAL_MOVEMENT_TYPES.expense}
        defaultValues={{ movementDate: "2026-10-18", description: "Compra" }}
        isSubmitting={false}
        submitLabel="Guardar"
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    )
    expect(screen.getByText("Gasto")).toBeInTheDocument()
    expect(screen.getByLabelText("Fecha")).toHaveValue("2026-10-18")
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it("renders read-only and submitting states", () => {
    const { rerender } = render(
      <FinancialMovementForm
        type={FINANCIAL_MOVEMENT_TYPES.sale}
        isSubmitting={false}
        isReadOnly
        submitLabel="Guardar"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(screen.getByLabelText("Fecha")).toBeDisabled()
    expect(
      screen.queryByRole("button", { name: "Guardar" }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Volver" })).toBeInTheDocument()
    rerender(
      <FinancialMovementForm
        type={FINANCIAL_MOVEMENT_TYPES.sale}
        isSubmitting
        submitLabel="Guardar"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled()
  })

  it("shows validation errors", async () => {
    render(
      <FinancialMovementForm
        type={FINANCIAL_MOVEMENT_TYPES.sale}
        defaultValues={{ movementDate: "", description: "" }}
        isSubmitting={false}
        submitLabel="Guardar"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }))
    await waitFor(() =>
      expect(screen.getByText("La fecha es obligatoria.")).toBeInTheDocument(),
    )
  })
})

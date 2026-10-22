import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MovementHistoryDetailEvidences } from "~/features/financial-movements/screens/movement-history-detail/components/movement-history-detail-evidences"
import { MovementHistoryDetailItems } from "~/features/financial-movements/screens/movement-history-detail/components/movement-history-detail-items"
import { MovementHistoryDetailSummary } from "~/features/financial-movements/screens/movement-history-detail/components/movement-history-detail-summary"
import { MovementEvidenceStatus } from "~/services/financial-movements/get-financial-movement-history-detail/interfaces"
import { FinancialMovementStatus } from "~/services/financial-movements/list-financial-movement-history/interfaces"

const movement = {
  id: "movement-id",
  businessId: "business-id",
  type: 1 as const,
  status: FinancialMovementStatus.Cancelled,
  movementDate: "2026-10-05",
  description: null,
  currencyCode: "PEN",
  totalAmount: 80,
  createdByUserId: "creator",
  updatedByUserId: "updater",
  confirmedByUserId: "confirmer",
  cancelledByUserId: "canceller",
  cancellationReason: "Registro duplicado",
  createdAt: "2026-10-05T20:00:00Z",
  updatedAt: "2026-10-05T22:00:00Z",
  confirmedAt: "2026-10-05T21:00:00Z",
  cancelledAt: "2026-10-05T22:00:00Z",
  discardedAt: null,
  estimatedCost: 40,
  estimatedMargin: 40,
  isEditable: false,
  allowedActions: [],
  version: 1,
  items: [],
  evidences: [],
}

describe("movement history detail components", () => {
  it("renders summary audit, cancellation and sale estimates", () => {
    render(<MovementHistoryDetailSummary movement={movement} />)
    expect(screen.getByText("Sin descripción")).toBeInTheDocument()
    expect(screen.getByText("Registro duplicado")).toBeInTheDocument()
    expect(screen.getByText("Costo estimado")).toBeInTheDocument()
    expect(screen.getByText("Margen estimado")).toBeInTheDocument()
  })

  it("omits optional audit and estimates for an expense", () => {
    render(
      <MovementHistoryDetailSummary
        movement={{
          ...movement,
          type: 2,
          status: FinancialMovementStatus.Discarded,
          confirmedAt: null,
          cancelledAt: null,
          cancellationReason: null,
          discardedAt: "2026-10-05T22:00:00Z",
          estimatedCost: null,
          estimatedMargin: null,
        }}
      />,
    )
    expect(screen.getByText("Gasto")).toBeInTheDocument()
    expect(screen.getAllByText("Descartado")).toHaveLength(2)
    expect(screen.queryByText("Costo estimado")).not.toBeInTheDocument()
  })

  it("renders active and retired items with historical catalogue states", () => {
    render(
      <MovementHistoryDetailItems
        currencyCode="PEN"
        items={[
          {
            id: "item-1",
            categoryId: "category-1",
            categoryName: null,
            categoryIsActive: null,
            productId: null,
            productName: null,
            productIsActive: null,
            description: "Servicio",
            quantity: 1,
            unitAmount: 20,
            unitCostSnapshot: null,
            subtotalAmount: 20,
            isActive: true,
            retiredAt: null,
            version: 1,
          },
          {
            id: "item-2",
            categoryId: "category-2",
            categoryName: "Ventas",
            categoryIsActive: false,
            productId: "product-2",
            productName: "Producto",
            productIsActive: false,
            description: "Producto retirado",
            quantity: 2,
            unitAmount: 30,
            unitCostSnapshot: 10,
            subtotalAmount: 60,
            isActive: false,
            retiredAt: "2026-10-05T22:00:00Z",
            version: 2,
          },
        ]}
      />,
    )
    expect(screen.getByText("Categoría no disponible")).toBeInTheDocument()
    expect(screen.getByText("Retirado")).toBeInTheDocument()
    expect(screen.getByText(/Categoría inactiva/)).toBeInTheDocument()
    expect(screen.getByText(/Producto inactivo/)).toBeInTheDocument()
  })

  it("renders empty item and evidence states", () => {
    render(
      <>
        <MovementHistoryDetailItems items={[]} currencyCode="PEN" />
        <MovementHistoryDetailEvidences
          evidences={[]}
          openingEvidenceId={null}
          error=""
          onOpenEvidence={vi.fn()}
        />
      </>,
    )
    expect(
      screen.getByText("El movimiento no contiene ítems."),
    ).toBeInTheDocument()
    expect(
      screen.getByText("El movimiento no contiene evidencias."),
    ).toBeInTheDocument()
  })

  it.each([
    [MovementEvidenceStatus.Active, "Activa"],
    [MovementEvidenceStatus.PendingPurge, "Pendiente de eliminación"],
    [MovementEvidenceStatus.Purged, "Eliminada"],
  ])("renders evidence status %s", (status, expectedLabel) => {
    render(
      <MovementHistoryDetailEvidences
        openingEvidenceId={null}
        error=""
        onOpenEvidence={vi.fn()}
        evidences={[
          {
            id: `evidence-${status}`,
            originalFileName: `archivo-${status}.pdf`,
            mimeType: "application/pdf",
            sizeBytes: 1024,
            status,
            uploadedAt: "2026-10-05T20:00:00Z",
            version: 1,
          },
        ]}
      />,
    )
    expect(
      screen.getByText(expectedLabel, { exact: false }),
    ).toBeInTheDocument()
  })

  it("opens only active evidences and exposes opening and error states", () => {
    const onOpenEvidence = vi.fn().mockResolvedValue(undefined)
    const { rerender } = render(
      <MovementHistoryDetailEvidences
        evidences={[
          {
            id: "active-evidence",
            originalFileName: "active.pdf",
            mimeType: "application/pdf",
            sizeBytes: 512,
            status: MovementEvidenceStatus.Active,
            uploadedAt: "2026-10-05T20:00:00Z",
            version: 1,
          },
          {
            id: "purged-evidence",
            originalFileName: "purged.pdf",
            mimeType: "application/pdf",
            sizeBytes: 512,
            status: MovementEvidenceStatus.Purged,
            uploadedAt: "2026-10-05T20:00:00Z",
            version: 1,
          },
        ]}
        openingEvidenceId={null}
        error=""
        onOpenEvidence={onOpenEvidence}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Abrir" }))
    expect(onOpenEvidence).toHaveBeenCalledWith("active-evidence")
    expect(screen.getAllByRole("button")).toHaveLength(1)

    rerender(
      <MovementHistoryDetailEvidences
        evidences={[
          {
            id: "active-evidence",
            originalFileName: "active.pdf",
            mimeType: "application/pdf",
            sizeBytes: 512,
            status: MovementEvidenceStatus.Active,
            uploadedAt: "2026-10-05T20:00:00Z",
            version: 1,
          },
        ]}
        openingEvidenceId="active-evidence"
        error="No fue posible abrir la evidencia."
        onOpenEvidence={onOpenEvidence}
      />,
    )
    expect(screen.getByRole("button", { name: "Abriendo..." })).toBeDisabled()
    expect(screen.getByRole("alert")).toHaveTextContent(
      "No fue posible abrir la evidencia.",
    )
  })

  it("renders opening balance as its own movement type", () => {
    render(<MovementHistoryDetailSummary movement={{ ...movement, type: 3 }} />)

    expect(screen.getByText("Saldo de apertura")).toBeInTheDocument()
    expect(screen.queryByText("Gasto")).not.toBeInTheDocument()
  })
})

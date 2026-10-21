import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MovementEvidenceCard } from "~/features/financial-movements/components/movement-evidence-card"

const evidence = {
  id: "evidence-id",
  movementId: "movement-id",
  replacesEvidenceId: null,
  originalFileName: "invoice.pdf",
  mimeType: "application/pdf",
  sizeBytes: 2048,
  status: 1,
  removalReason: null,
  uploadedAt: "2026-10-21T06:00:00Z",
  markedForPurgeAt: null,
  purgeAfter: null,
  purgedAt: null,
  version: 2,
}

describe("MovementEvidenceCard", () => {
  it("renders metadata and dispatches every action", () => {
    const onOpen = vi.fn()
    const onReplace = vi.fn()
    const onRemove = vi.fn()
    render(
      <MovementEvidenceCard
        evidence={evidence}
        isBusy={false}
        onOpen={onOpen}
        onReplace={onReplace}
        onRemove={onRemove}
      />,
    )

    expect(screen.getByText("invoice.pdf")).toBeInTheDocument()
    expect(screen.getByText("application/pdf · 2.0 KB")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: /Abrir/ }))
    fireEvent.click(screen.getByRole("button", { name: /Sustituir/ }))
    fireEvent.click(screen.getByRole("button", { name: /Retirar/ }))

    expect(onOpen).toHaveBeenCalledWith(evidence)
    expect(onReplace).toHaveBeenCalledWith(evidence)
    expect(onRemove).toHaveBeenCalledWith(evidence)
  })

  it("disables every action while busy", () => {
    render(
      <MovementEvidenceCard
        evidence={evidence}
        isBusy
        onOpen={vi.fn()}
        onReplace={vi.fn()}
        onRemove={vi.fn()}
      />,
    )
    expect(screen.getByRole("button", { name: /Abrir/ })).toBeDisabled()
    expect(screen.getByRole("button", { name: /Sustituir/ })).toBeDisabled()
    expect(screen.getByRole("button", { name: /Retirar/ })).toBeDisabled()
  })
})

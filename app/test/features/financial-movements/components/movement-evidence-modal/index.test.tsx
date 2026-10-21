import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MovementEvidenceModal } from "~/features/financial-movements/components/movement-evidence-modal"

vi.mock(
  "~/features/financial-movements/components/movement-evidence-upload-form",
  () => ({
    MovementEvidenceUploadForm: ({ submitLabel }: { submitLabel: string }) => (
      <div>{submitLabel}</div>
    ),
  }),
)

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

describe("MovementEvidenceModal", () => {
  it("returns null while closed", () => {
    render(
      <MovementEvidenceModal
        isOpen={false}
        evidence={null}
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    )
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("renders attachment mode", () => {
    render(
      <MovementEvidenceModal
        isOpen
        evidence={null}
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    )
    expect(
      screen.getByRole("heading", { name: "Adjuntar evidencia" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Adjuntar archivo")).toBeInTheDocument()
  })

  it("renders replacement mode and the current file", () => {
    render(
      <MovementEvidenceModal
        isOpen
        evidence={evidence}
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    )
    expect(
      screen.getByRole("heading", { name: "Sustituir evidencia" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Archivo actual: invoice.pdf")).toBeInTheDocument()
    expect(screen.getByText("Sustituir archivo")).toBeInTheDocument()
  })
})

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MovementEvidenceUploadForm } from "~/features/financial-movements/components/movement-evidence-upload-form"
import { MOVEMENT_EVIDENCE_ACCEPTED_TYPES } from "~/features/financial-movements/components/movement-evidence-upload-form/constants"

describe("MovementEvidenceUploadForm", () => {
  it("requires a file", async () => {
    render(
      <MovementEvidenceUploadForm
        isSubmitting={false}
        submitLabel="Adjuntar archivo"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Adjuntar archivo" }))

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Selecciona un archivo JPEG, PNG o PDF.",
    )
  })

  it("submits the selected file and clears validation", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const file = new File(["image"], "evidence.png", { type: "image/png" })
    render(
      <MovementEvidenceUploadForm
        isSubmitting={false}
        submitLabel="Adjuntar archivo"
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Adjuntar archivo" }))
    await screen.findByRole("alert")
    const fileInput = screen.getByLabelText("Archivo")
    fireEvent.change(fileInput, { target: { files: [file] } })
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(fileInput).toHaveAttribute(
      "accept",
      MOVEMENT_EVIDENCE_ACCEPTED_TYPES,
    )
    fireEvent.click(screen.getByRole("button", { name: "Adjuntar archivo" }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(file))
  })

  it("cancels and disables controls while submitting", () => {
    const onCancel = vi.fn()
    render(
      <MovementEvidenceUploadForm
        isSubmitting
        submitLabel="Adjuntar archivo"
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    )

    expect(screen.getByLabelText("Archivo")).toBeDisabled()
    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled()
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }))
    expect(onCancel).not.toHaveBeenCalled()
  })
})

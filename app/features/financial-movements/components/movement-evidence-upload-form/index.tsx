import { useState } from "react"
import { Button } from "~/shared/components/ui/button"
import { Input } from "~/shared/components/ui/input"
import { MOVEMENT_EVIDENCE_ACCEPTED_TYPES } from "./constants"
import type { MovementEvidenceUploadFormProps } from "./interfaces"

export function MovementEvidenceUploadForm({
  isSubmitting,
  submitLabel,
  onSubmit,
  onCancel,
}: Readonly<MovementEvidenceUploadFormProps>) {
  const [file, setFile] = useState<File | null>(null)
  const [validationError, setValidationError] = useState("")

  function selectFile(event: React.ChangeEvent<HTMLInputElement>): void {
    setFile(event.target.files?.[0] ?? null)
    setValidationError("")
  }

  async function submitEvidence(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault()
    if (!file) {
      setValidationError("Selecciona un archivo JPEG, PNG o PDF.")
      return
    }
    await onSubmit(file)
  }

  return (
    <form className="grid gap-4" onSubmit={submitEvidence} noValidate>
      <label className="grid gap-2">
        <label htmlFor="movement-evidence-file">Archivo</label>
        <Input
          id="movement-evidence-file"
          name="movementEvidenceFile"
          type="file"
          accept={MOVEMENT_EVIDENCE_ACCEPTED_TYPES}
          disabled={isSubmitting}
          onChange={selectFile}
        />
        <small className="text-muted-foreground">
          Formatos admitidos: JPEG, PNG y PDF.
        </small>
        {validationError ? (
          <span role="alert" className="text-sm text-destructive">
            {validationError}
          </span>
        ) : null}
      </label>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}

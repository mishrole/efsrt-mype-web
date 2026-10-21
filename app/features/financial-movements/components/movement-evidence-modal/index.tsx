import { MovementEvidenceUploadForm } from "~/features/financial-movements/components/movement-evidence-upload-form"
import type { MovementEvidenceModalProps } from "./interfaces"

export function MovementEvidenceModal({
  isOpen,
  evidence,
  isSubmitting,
  onClose,
  onSubmit,
}: Readonly<MovementEvidenceModalProps>) {
  if (!isOpen) {
    return null
  }
  const isReplacing = evidence !== null
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="movement-evidence-modal-title"
        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="movement-evidence-modal-title" className="mt-0">
          {isReplacing ? "Sustituir evidencia" : "Adjuntar evidencia"}
        </h2>
        {isReplacing ? (
          <p className="text-sm text-muted-foreground">
            Archivo actual: {evidence.originalFileName}
          </p>
        ) : null}
        <MovementEvidenceUploadForm
          isSubmitting={isSubmitting}
          submitLabel={isReplacing ? "Sustituir archivo" : "Adjuntar archivo"}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </section>
    </div>
  )
}

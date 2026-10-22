import { ExternalLinkIcon, FileIcon } from "lucide-react"
import { MovementEvidenceStatus } from "~/services/financial-movements/get-financial-movement-history-detail/interfaces"
import { Button } from "~/shared/components/ui/button"
import { formatDateTime } from "~/shared/utils/date"
import type { MovementHistoryDetailEvidencesProps } from "./interfaces"

function getEvidenceStatusLabel(status: MovementEvidenceStatus): string {
  switch (status) {
    case MovementEvidenceStatus.Active:
      return "Activa"
    case MovementEvidenceStatus.PendingPurge:
      return "Pendiente de eliminación"
    case MovementEvidenceStatus.Purged:
      return "Eliminada"
  }
}

export function MovementHistoryDetailEvidences({
  evidences,
  openingEvidenceId,
  error,
  onOpenEvidence,
}: Readonly<MovementHistoryDetailEvidencesProps>) {
  function openEvidence(evidenceId: string): void {
    void onOpenEvidence(evidenceId)
  }

  return (
    <section className="grid gap-3" aria-labelledby="movement-evidences-title">
      <h2 id="movement-evidences-title" className="m-0 text-xl font-bold">
        Evidencias
      </h2>
      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-[#f0c7cf] bg-[#fff5f6] p-3 text-sm text-[#9f243b]"
        >
          {error}
        </div>
      ) : null}
      {evidences.length === 0 ? (
        <p className="m-0 rounded-2xl border border-dashed border-[#b8c7e5] bg-white p-5 text-[#667085]">
          El movimiento no contiene evidencias.
        </p>
      ) : (
        evidences.map((evidence) => {
          const isOpening = openingEvidenceId === evidence.id
          const canOpen = evidence.status === MovementEvidenceStatus.Active

          return (
            <article
              key={evidence.id}
              className="flex flex-col gap-3 rounded-2xl border border-[#e1e6ef] bg-white p-4 min-[641px]:flex-row min-[641px]:items-center min-[641px]:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <FileIcon
                  className="mt-0.5 size-5 shrink-0 text-[#2b5fce]"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <h3 className="m-0 truncate text-base font-bold">
                    {evidence.originalFileName}
                  </h3>
                  <p className="mt-1 mb-0 text-sm text-[#667085]">
                    {evidence.mimeType} · {evidence.sizeBytes} bytes ·{" "}
                    {getEvidenceStatusLabel(evidence.status)}
                  </p>
                  <p className="mt-1 mb-0 text-sm text-[#667085]">
                    Subida: {formatDateTime(evidence.uploadedAt)}
                  </p>
                </div>
              </div>
              {canOpen ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={openingEvidenceId !== null}
                  onClick={() => openEvidence(evidence.id)}
                >
                  <ExternalLinkIcon
                    data-icon="inline-start"
                    aria-hidden="true"
                  />
                  {isOpening ? "Abriendo..." : "Abrir"}
                </Button>
              ) : null}
            </article>
          )
        })
      )}
    </section>
  )
}

import { FileIcon } from "lucide-react"
import { MovementEvidenceStatus } from "~/services/financial-movements/get-financial-movement-history-detail/interfaces"
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
}: Readonly<MovementHistoryDetailEvidencesProps>) {
  return (
    <section className="grid gap-3" aria-labelledby="movement-evidences-title">
      <h2 id="movement-evidences-title" className="m-0 text-xl font-bold">
        Evidencias
      </h2>
      {evidences.length === 0 ? (
        <p className="m-0 rounded-2xl border border-dashed border-[#b8c7e5] bg-white p-5 text-[#667085]">
          El movimiento no contiene evidencias.
        </p>
      ) : (
        evidences.map((evidence) => (
          <article
            key={evidence.id}
            className="flex items-start gap-3 rounded-2xl border border-[#e1e6ef] bg-white p-4"
          >
            <FileIcon
              className="mt-0.5 size-5 text-[#2b5fce]"
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
          </article>
        ))
      )}
    </section>
  )
}

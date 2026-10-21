import { ExternalLinkIcon, RefreshCcwIcon, Trash2Icon } from "lucide-react"
import { Button } from "~/shared/components/ui/button"
import type { MovementEvidenceCardProps } from "./interfaces"
import { formatFileSize } from "./utils"

export function MovementEvidenceCard({
  evidence,
  isBusy,
  onOpen,
  onReplace,
  onRemove,
}: Readonly<MovementEvidenceCardProps>) {
  function openEvidence(): void {
    onOpen(evidence)
  }
  function replaceEvidence(): void {
    onReplace(evidence)
  }
  function removeEvidence(): void {
    onRemove(evidence)
  }
  return (
    <article className="grid gap-3 rounded-xl border p-4 min-[721px]:grid-cols-[minmax(0,1fr)_auto] min-[721px]:items-center">
      <div>
        <strong className="break-all">{evidence.originalFileName}</strong>
        <p className="m-0 text-sm text-muted-foreground">
          {evidence.mimeType} · {formatFileSize(evidence.sizeBytes)}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isBusy}
          onClick={openEvidence}
        >
          <ExternalLinkIcon aria-hidden="true" />
          Abrir
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isBusy}
          onClick={replaceEvidence}
        >
          <RefreshCcwIcon aria-hidden="true" />
          Sustituir
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={isBusy}
          onClick={removeEvidence}
        >
          <Trash2Icon aria-hidden="true" />
          Retirar
        </Button>
      </div>
    </article>
  )
}

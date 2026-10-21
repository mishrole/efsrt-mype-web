import { PaperclipIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { MovementEvidenceCard } from "~/features/financial-movements/components/movement-evidence-card"
import { MovementEvidenceModal } from "~/features/financial-movements/components/movement-evidence-modal"
import { attachMovementEvidence } from "~/services/financial-movements/attach-movement-evidence"
import type { MovementEvidenceResponse } from "~/services/financial-movements/evidence-interfaces"
import { listMovementEvidences } from "~/services/financial-movements/list-movement-evidences"
import { openMovementEvidence } from "~/services/financial-movements/open-movement-evidence"
import { removeMovementEvidence } from "~/services/financial-movements/remove-movement-evidence"
import { replaceMovementEvidence } from "~/services/financial-movements/replace-movement-evidence"
import { Button } from "~/shared/components/ui/button"
import { isApiError } from "~/shared/http/errors"
import type { MovementEvidencesPanelProps } from "./interfaces"

export function MovementEvidencesPanel({
  businessId,
  movementId,
  movementVersion,
  onMovementChanged,
  showHeading = true,
}: Readonly<MovementEvidencesPanelProps>) {
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const [evidences, setEvidences] = useState<MovementEvidenceResponse[]>([])
  const [selectedEvidence, setSelectedEvidence] =
    useState<MovementEvidenceResponse | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState("")

  const loadEvidences = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      if (!accessToken) {
        setEvidences([])
        return
      }
      const response = await listMovementEvidences(
        businessId,
        movementId,
        accessToken,
        signal,
      )
      if (!signal?.aborted) {
        setEvidences(response)
      }
    },
    [accessToken, businessId, movementId],
  )

  useEffect(() => {
    const controller = new AbortController()
    async function initializeEvidences(): Promise<void> {
      try {
        await loadEvidences(controller.signal)
      } catch (exception) {
        if (!controller.signal.aborted) {
          setError(
            isApiError(exception)
              ? exception.message
              : "No fue posible cargar las evidencias.",
          )
        }
      }
    }
    void initializeEvidences()
    return () => controller.abort()
  }, [loadEvidences])

  function openAttachModal(): void {
    setSelectedEvidence(null)
    setError("")
    setIsModalOpen(true)
  }
  function openReplaceModal(evidence: MovementEvidenceResponse): void {
    setSelectedEvidence(evidence)
    setError("")
    setIsModalOpen(true)
  }
  function closeModal(): void {
    if (!isBusy) {
      setSelectedEvidence(null)
      setIsModalOpen(false)
    }
  }

  async function submitEvidence(file: File): Promise<void> {
    if (!accessToken || isBusy) {
      return
    }
    setIsBusy(true)
    setError("")
    try {
      const response = selectedEvidence
        ? await replaceMovementEvidence(
            businessId,
            movementId,
            selectedEvidence.id,
            {
              file,
              movementVersion,
              evidenceVersion: selectedEvidence.version,
            },
            accessToken,
          )
        : await attachMovementEvidence(
            businessId,
            movementId,
            { file, movementVersion },
            accessToken,
          )
      setEvidences((currentEvidences) =>
        selectedEvidence
          ? currentEvidences.map((evidence) =>
              evidence.id === selectedEvidence.id ? response : evidence,
            )
          : [...currentEvidences, response],
      )
      setSelectedEvidence(null)
      setIsModalOpen(false)
      await onMovementChanged()
    } catch (exception) {
      setError(
        isApiError(exception)
          ? exception.message
          : "No fue posible guardar la evidencia.",
      )
    } finally {
      setIsBusy(false)
    }
  }

  async function openEvidence(
    evidence: MovementEvidenceResponse,
  ): Promise<void> {
    if (!accessToken || isBusy) {
      return
    }
    setIsBusy(true)
    setError("")
    try {
      const response = await openMovementEvidence(
        businessId,
        movementId,
        evidence.id,
        accessToken,
      )
      window.open(response.url, "_blank", "noopener,noreferrer")
    } catch (exception) {
      setError(
        isApiError(exception)
          ? exception.message
          : "No fue posible abrir la evidencia.",
      )
    } finally {
      setIsBusy(false)
    }
  }

  async function removeEvidence(
    evidence: MovementEvidenceResponse,
  ): Promise<void> {
    if (!accessToken || isBusy) {
      return
    }
    setIsBusy(true)
    setError("")
    try {
      await removeMovementEvidence(
        businessId,
        movementId,
        evidence.id,
        { movementVersion, evidenceVersion: evidence.version },
        accessToken,
      )
      setEvidences((currentEvidences) =>
        currentEvidences.filter(
          (currentEvidence) => currentEvidence.id !== evidence.id,
        ),
      )
      await onMovementChanged()
    } catch (exception) {
      setError(
        isApiError(exception)
          ? exception.message
          : "No fue posible retirar la evidencia.",
      )
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <section className="grid gap-4">
      <header className="flex flex-col gap-3 min-[481px]:flex-row min-[481px]:items-center min-[481px]:justify-between">
        {showHeading ? (
          <div>
            <h2 className="m-0 text-xl font-bold">Evidencias</h2>
            <p className="m-0 text-sm text-muted-foreground">
              Archivos activos asociados al movimiento
            </p>
          </div>
        ) : null}
        <Button type="button" onClick={openAttachModal}>
          <PaperclipIcon aria-hidden="true" />
          Adjuntar evidencia
        </Button>
      </header>
      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}
      {evidences.length === 0 ? (
        <p className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">
          Aún no hay evidencias activas.
        </p>
      ) : (
        <div className="grid gap-3">
          {evidences.map((evidence) => (
            <MovementEvidenceCard
              key={evidence.id}
              evidence={evidence}
              isBusy={isBusy}
              onOpen={(currentEvidence) => void openEvidence(currentEvidence)}
              onReplace={openReplaceModal}
              onRemove={(currentEvidence) =>
                void removeEvidence(currentEvidence)
              }
            />
          ))}
        </div>
      )}
      <MovementEvidenceModal
        isOpen={isModalOpen}
        evidence={selectedEvidence}
        isSubmitting={isBusy}
        onClose={closeModal}
        onSubmit={submitEvidence}
      />
    </section>
  )
}

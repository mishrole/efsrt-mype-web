import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import { getFinancialMovementHistoryDetail } from "~/services/financial-movements/get-financial-movement-history-detail"
import type { FinancialMovementHistoryDetailResponse } from "~/services/financial-movements/get-financial-movement-history-detail/interfaces"
import { openMovementEvidence } from "~/services/financial-movements/open-movement-evidence"
import { APP_PATHS } from "~/shared/constants/pages"
import { isApiError } from "~/shared/http/errors"
import type { UseMovementHistoryDetailResult } from "./interfaces"

function getErrorMessage(exception: unknown, fallbackMessage: string): string {
  if (isApiError(exception)) {
    return exception.message
  }

  return fallbackMessage
}

export function useMovementHistoryDetail(): UseMovementHistoryDetailResult {
  const navigate = useNavigate()
  const { movementId = "" } = useParams()
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const businessId = useBusinessContextStore((state) => state.currentBusinessId)
  const hasRequestContext = Boolean(accessToken && businessId && movementId)
  const [movement, setMovement] =
    useState<FinancialMovementHistoryDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [evidenceError, setEvidenceError] = useState("")
  const [openingEvidenceId, setOpeningEvidenceId] = useState<string | null>(
    null,
  )

  useEffect(() => {
    if (!accessToken || !businessId || !movementId) {
      return
    }

    const detailRequestController = new AbortController()

    getFinancialMovementHistoryDetail(
      businessId,
      movementId,
      accessToken,
      detailRequestController.signal,
    )
      .then((movementResponse) => {
        if (!detailRequestController.signal.aborted) {
          setMovement(movementResponse)
        }
      })
      .catch((exception: unknown) => {
        if (!detailRequestController.signal.aborted) {
          setError(
            getErrorMessage(
              exception,
              "No fue posible cargar el detalle del movimiento.",
            ),
          )
        }
      })
      .finally(() => {
        if (!detailRequestController.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => detailRequestController.abort()
  }, [accessToken, businessId, movementId])

  async function openEvidence(evidenceId: string): Promise<void> {
    if (!accessToken || !businessId || !movementId || openingEvidenceId) {
      return
    }

    setOpeningEvidenceId(evidenceId)
    setEvidenceError("")

    try {
      const evidenceAccess = await openMovementEvidence(
        businessId,
        movementId,
        evidenceId,
        accessToken,
      )
      window.open(evidenceAccess.url, "_blank", "noopener,noreferrer")
    } catch (exception) {
      setEvidenceError(
        getErrorMessage(exception, "No fue posible abrir la evidencia."),
      )
    } finally {
      setOpeningEvidenceId(null)
    }
  }

  function returnToHistory(): void {
    void navigate(APP_PATHS.FINANCIAL_MOVEMENTS)
  }

  return {
    movement: hasRequestContext ? movement : null,
    isLoading: hasRequestContext ? isLoading : false,
    error: hasRequestContext ? error : "",
    evidenceError: hasRequestContext ? evidenceError : "",
    openingEvidenceId: hasRequestContext ? openingEvidenceId : null,
    openEvidence,
    returnToHistory,
  }
}

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import { getFinancialMovementHistoryDetail } from "~/services/financial-movements/get-financial-movement-history-detail"
import type { FinancialMovementHistoryDetailResponse } from "~/services/financial-movements/get-financial-movement-history-detail/interfaces"
import { APP_PATHS } from "~/shared/constants/pages"
import { isApiError } from "~/shared/http/errors"
import type { UseMovementHistoryDetailResult } from "./interfaces"

function getErrorMessage(exception: unknown): string {
  if (isApiError(exception)) {
    return exception.message
  }

  return "No fue posible cargar el detalle del movimiento."
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
          setError(getErrorMessage(exception))
        }
      })
      .finally(() => {
        if (!detailRequestController.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => detailRequestController.abort()
  }, [accessToken, businessId, movementId])

  function returnToHistory(): void {
    void navigate(APP_PATHS.FINANCIAL_MOVEMENTS)
  }

  return {
    movement: hasRequestContext ? movement : null,
    isLoading: hasRequestContext ? isLoading : false,
    error: hasRequestContext ? error : "",
    returnToHistory,
  }
}

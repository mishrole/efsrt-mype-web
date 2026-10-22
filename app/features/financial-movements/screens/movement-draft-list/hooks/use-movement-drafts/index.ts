import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import { FINANCIAL_MOVEMENT_PERMISSIONS } from "~/features/financial-movements/constants"
import type { FinancialMovementDraftListItemResponse } from "~/services/financial-movements/interfaces"
import { listFinancialMovementDrafts } from "~/services/financial-movements/list-financial-movement-drafts"
import { APP_PATHS } from "~/shared/constants/pages"
import { isApiError } from "~/shared/http/errors"
import type { UseMovementDraftsResult } from "./interfaces"

function getErrorMessage(exception: unknown): string {
  if (isApiError(exception)) {
    return exception.message
  }

  return "No fue posible cargar los borradores financieros."
}

export function useMovementDrafts(): UseMovementDraftsResult {
  const navigate = useNavigate()
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const businessId = useBusinessContextStore((state) => state.currentBusinessId)
  const context = useBusinessContextStore((state) => state.context)
  const [movements, setMovements] = useState<
    FinancialMovementDraftListItemResponse[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const loadMovements = useCallback(
    async (signal: AbortSignal): Promise<void> => {
      if (!accessToken || !businessId) {
        setMovements([])
        setIsLoading(false)
        return
      }

      setMovements([])
      setIsLoading(true)
      setError("")

      try {
        const response = await listFinancialMovementDrafts(
          businessId,
          accessToken,
          signal,
        )

        if (!signal.aborted) {
          setMovements(response)
        }
      } catch (exception) {
        if (!signal.aborted) {
          setError(getErrorMessage(exception))
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false)
        }
      }
    },
    [accessToken, businessId],
  )

  useEffect(() => {
    const controller = new AbortController()

    async function synchronizeMovements(): Promise<void> {
      await loadMovements(controller.signal)
    }

    void synchronizeMovements()
    return () => controller.abort()
  }, [loadMovements])

  function createSale(): void {
    void navigate(APP_PATHS.FINANCIAL_MOVEMENT_CREATE("sale"))
  }

  function createExpense(): void {
    void navigate(APP_PATHS.FINANCIAL_MOVEMENT_CREATE("expense"))
  }

  function viewMovement(movementId: string): void {
    void navigate(APP_PATHS.FINANCIAL_MOVEMENT_DETAIL(movementId))
  }

  function returnToDashboard(): void {
    void navigate(APP_PATHS.DASHBOARD)
  }

  function returnToFinancialMovements(): void {
    void navigate(APP_PATHS.FINANCIAL_MOVEMENTS)
  }

  return {
    movements,
    canCreate:
      context?.permissions.includes(FINANCIAL_MOVEMENT_PERMISSIONS.create) ??
      false,
    isLoading,
    error,
    createSale,
    createExpense,
    viewMovement,
    returnToDashboard,
    returnToFinancialMovements,
  }
}

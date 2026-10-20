import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import type { FinancialMovementFormValues } from "~/features/financial-movements/components/financial-movement-form/schema"
import { FINANCIAL_MOVEMENT_PERMISSIONS } from "~/features/financial-movements/constants"
import { getFinancialMovementDraft } from "~/services/financial-movements/get-financial-movement-draft"
import type { FinancialMovementDraftResponse } from "~/services/financial-movements/interfaces"
import { updateFinancialMovementDraft } from "~/services/financial-movements/update-financial-movement-draft"
import { APP_PATHS } from "~/shared/constants/pages"
import { isApiError } from "~/shared/http/errors"
import type { UseMovementDraftDetailResult } from "./interfaces"

export function useMovementDraftDetail(): UseMovementDraftDetailResult {
  const navigate = useNavigate()
  const { movementId = "" } = useParams()
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const businessId = useBusinessContextStore((state) => state.currentBusinessId)
  const context = useBusinessContextStore((state) => state.context)
  const [movement, setMovement] =
    useState<FinancialMovementDraftResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const scope = useMemo(() => {
    if (!businessId || !movementId) {
      return null
    }

    return { businessId, movementId }
  }, [businessId, movementId])

  const loadMovement = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      if (!accessToken || !scope) {
        setMovement(null)
        return
      }

      setMovement(null)
      setError("")

      try {
        const response = await getFinancialMovementDraft(
          scope.businessId,
          scope.movementId,
          accessToken,
          signal,
        )

        if (!signal?.aborted) {
          setMovement(response)
        }
      } catch (exception) {
        if (!signal?.aborted) {
          setError(
            isApiError(exception)
              ? exception.message
              : "No fue posible cargar el borrador financiero.",
          )
        }
      }
    },
    [accessToken, scope],
  )

  useEffect(() => {
    const controller = new AbortController()

    async function synchronizeMovement(): Promise<void> {
      await loadMovement(controller.signal)
    }

    void synchronizeMovement()
    return () => controller.abort()
  }, [loadMovement])

  async function submitMovement(
    values: FinancialMovementFormValues,
  ): Promise<void> {
    if (!accessToken || !scope || !movement || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await updateFinancialMovementDraft(
        scope.businessId,
        scope.movementId,
        {
          movementDate: values.movementDate,
          description: values.description.trim() || null,
          version: movement.version,
        },
        accessToken,
      )
      setMovement(response)
    } catch (exception) {
      setError(
        isApiError(exception)
          ? exception.message
          : "No fue posible actualizar el borrador financiero.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function reloadMovement(): Promise<void> {
    await loadMovement()
  }

  function returnToMovements(): void {
    void navigate(APP_PATHS.FINANCIAL_MOVEMENTS)
  }

  return {
    movement,
    canUpdate:
      context?.permissions.includes(FINANCIAL_MOVEMENT_PERMISSIONS.update) ??
      false,
    isLoading: !movement && !error,
    isSubmitting,
    error,
    submitMovement,
    returnToMovements,
    reloadMovement,
  }
}

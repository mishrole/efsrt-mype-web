import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import type { FinancialMovementFormValues } from "~/features/financial-movements/components/financial-movement-form/schema"
import { FINANCIAL_MOVEMENT_PERMISSIONS } from "~/features/financial-movements/constants"
import { confirmFinancialMovement } from "~/services/financial-movements/confirm-financial-movement"
import type { ConfirmFinancialMovementItemVersion } from "~/services/financial-movements/confirm-financial-movement/interfaces"
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
  const [itemVersions, setItemVersions] = useState<
    ConfirmFinancialMovementItemVersion[]
  >([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [error, setError] = useState("")
  const scope = useMemo(() => {
    if (!businessId || !movementId) {
      return null
    }

    return { businessId, movementId }
  }, [businessId, movementId])

  const canUpdate = useMemo(
    () =>
      context?.permissions.includes(FINANCIAL_MOVEMENT_PERMISSIONS.update) ??
      false,
    [context?.permissions],
  )
  const canConfirm = useMemo(
    () =>
      context?.permissions.includes(FINANCIAL_MOVEMENT_PERMISSIONS.confirm) ??
      false,
    [context?.permissions],
  )

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

  const submitMovement = useCallback(
    async (values: FinancialMovementFormValues): Promise<void> => {
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
    },
    [accessToken, isSubmitting, movement, scope],
  )

  const reloadMovement = useCallback(async (): Promise<void> => {
    await loadMovement()
  }, [loadMovement])

  const returnToMovements = useCallback((): void => {
    void navigate(APP_PATHS.FINANCIAL_MOVEMENTS)
  }, [navigate])

  const applyMovementSummary = useCallback(
    (movementTotal: number, movementVersion: number): void => {
      setMovement((currentMovement) => {
        if (!currentMovement) {
          return null
        }

        if (
          currentMovement.totalAmount === movementTotal &&
          currentMovement.version === movementVersion
        ) {
          return currentMovement
        }

        return {
          ...currentMovement,
          totalAmount: movementTotal,
          version: movementVersion,
        }
      })
    },
    [],
  )

  const applyMovementItems = useCallback(
    (items: ConfirmFinancialMovementItemVersion[]): void => {
      setItemVersions(items)
    },
    [],
  )

  const openConfirmDialog = useCallback((): void => {
    setError("")
    setIsConfirmDialogOpen(true)
  }, [])

  const closeConfirmDialog = useCallback((): void => {
    if (!isConfirming) {
      setIsConfirmDialogOpen(false)
    }
  }, [isConfirming])

  const confirmMovement = useCallback(async (): Promise<void> => {
    if (!accessToken || !scope || !movement || !canConfirm || isConfirming) {
      return
    }

    if (itemVersions.length === 0) {
      setError(
        "El movimiento requiere al menos un ítem activo para confirmarse.",
      )
      setIsConfirmDialogOpen(false)
      return
    }

    setIsConfirming(true)
    setError("")

    try {
      await confirmFinancialMovement(
        scope.businessId,
        scope.movementId,
        {
          movementVersion: movement.version,
          itemVersions,
        },
        accessToken,
      )
      setIsConfirmDialogOpen(false)
      void navigate(APP_PATHS.FINANCIAL_MOVEMENTS)
    } catch (exception) {
      setError(
        isApiError(exception)
          ? exception.message
          : "No fue posible confirmar el movimiento financiero.",
      )
    } finally {
      setIsConfirming(false)
    }
  }, [
    accessToken,
    canConfirm,
    isConfirming,
    itemVersions,
    movement,
    navigate,
    scope,
  ])

  return {
    movement,
    itemVersions,
    canUpdate,
    canConfirm,
    isLoading: !movement && !error,
    isSubmitting,
    isConfirming,
    isConfirmDialogOpen,
    error,
    submitMovement,
    returnToMovements,
    reloadMovement,
    applyMovementSummary,
    applyMovementItems,
    openConfirmDialog,
    closeConfirmDialog,
    confirmMovement,
  }
}

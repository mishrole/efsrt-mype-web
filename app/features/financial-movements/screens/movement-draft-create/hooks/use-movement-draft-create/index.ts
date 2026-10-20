import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import type { FinancialMovementFormValues } from "~/features/financial-movements/components/financial-movement-form/schema"
import {
  FINANCIAL_MOVEMENT_TYPES,
  type FinancialMovementType,
} from "~/features/financial-movements/constants"
import { createFinancialMovementDraft } from "~/services/financial-movements/create-financial-movement-draft"
import { APP_PATHS } from "~/shared/constants/pages"
import { isApiError } from "~/shared/http/errors"
import type { UseMovementDraftCreateResult } from "./interfaces"

function getMovementType(routeType: string): FinancialMovementType | null {
  if (routeType === "sale") {
    return FINANCIAL_MOVEMENT_TYPES.sale
  }

  if (routeType === "expense") {
    return FINANCIAL_MOVEMENT_TYPES.expense
  }

  return null
}

export function useMovementDraftCreate(): UseMovementDraftCreateResult {
  const navigate = useNavigate()
  const { movementType = "" } = useParams()
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const businessId = useBusinessContextStore((state) => state.currentBusinessId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const type = useMemo(() => getMovementType(movementType), [movementType])

  async function submitMovement(
    values: FinancialMovementFormValues,
  ): Promise<void> {
    if (!accessToken || !businessId || !type || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const createdMovement = await createFinancialMovementDraft(
        businessId,
        {
          type,
          movementDate: values.movementDate,
          description: values.description.trim() || null,
        },
        accessToken,
      )

      void navigate(APP_PATHS.FINANCIAL_MOVEMENT_DETAIL(createdMovement.id))
    } catch (exception) {
      setError(
        isApiError(exception)
          ? exception.message
          : "No fue posible crear el borrador financiero.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function returnToMovements(): void {
    void navigate(APP_PATHS.FINANCIAL_MOVEMENTS)
  }

  return {
    type,
    isSubmitting,
    error,
    submitMovement,
    returnToMovements,
  }
}

import { z } from "zod"
import { FINANCIAL_MOVEMENT_DESCRIPTION_MAX_LENGTH } from "~/features/financial-movements/constants"

export const financialMovementFormSchema = z.object({
  movementDate: z.string().min(1, "La fecha es obligatoria."),
  description: z
    .string()
    .max(
      FINANCIAL_MOVEMENT_DESCRIPTION_MAX_LENGTH,
      `La descripción no puede superar los ${FINANCIAL_MOVEMENT_DESCRIPTION_MAX_LENGTH} caracteres.`,
    ),
})

export type FinancialMovementFormValues = z.infer<
  typeof financialMovementFormSchema
>

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  FINANCIAL_MOVEMENT_DESCRIPTION_MAX_LENGTH,
  FINANCIAL_MOVEMENT_TYPES,
} from "~/features/financial-movements/constants"
import { Button } from "~/shared/components/ui/button"
import { Input } from "~/shared/components/ui/input"
import { Textarea } from "~/shared/components/ui/textarea"
import type { FinancialMovementFormProps } from "./interfaces"
import {
  financialMovementFormSchema,
  type FinancialMovementFormValues,
} from "./schema"

function getCurrentLocalDate(): string {
  const currentDate = new Date()
  const timezoneOffset = currentDate.getTimezoneOffset() * 60_000

  return new Date(currentDate.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 10)
}

export function FinancialMovementForm({
  type,
  defaultValues,
  isSubmitting,
  isReadOnly = false,
  submitLabel,
  onSubmit,
  onCancel,
}: Readonly<FinancialMovementFormProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FinancialMovementFormValues>({
    resolver: zodResolver(financialMovementFormSchema),
    defaultValues: defaultValues ?? {
      movementDate: getCurrentLocalDate(),
      description: "",
    },
  })
  const movementTypeLabel =
    type === FINANCIAL_MOVEMENT_TYPES.sale ? "Venta" : "Gasto"

  return (
    <form
      className="grid gap-6 rounded-2xl border border-[#e1e6ef] bg-white p-5 shadow-sm min-[641px]:p-7"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid gap-2">
        <span className="text-sm font-bold text-[#27324a]">Tipo</span>
        <div className="min-h-12 rounded-xl border border-[#d9e0ec] bg-[#f7f9fc] px-3 py-3 text-sm font-semibold text-[#46536b]">
          {movementTypeLabel}
        </div>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-bold text-[#27324a]">Fecha</span>
        <Input
          type="date"
          disabled={isSubmitting || isReadOnly}
          aria-invalid={Boolean(errors.movementDate)}
          {...register("movementDate")}
        />
        <span className="min-h-5 text-sm text-[#b3263e]">
          {errors.movementDate?.message}
        </span>
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-bold text-[#27324a]">
          Descripción opcional
        </span>
        <Textarea
          maxLength={FINANCIAL_MOVEMENT_DESCRIPTION_MAX_LENGTH}
          rows={4}
          disabled={isSubmitting || isReadOnly}
          aria-invalid={Boolean(errors.description)}
          {...register("description")}
        />
        <span className="min-h-5 text-sm text-[#b3263e]">
          {errors.description?.message}
        </span>
      </label>

      <div className="flex flex-col-reverse gap-3 border-t border-[#e5eaf2] pt-5 min-[481px]:flex-row min-[481px]:justify-end">
        <Button
          type="button"
          variant="ghost"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          {isReadOnly ? "Volver" : "Cancelar"}
        </Button>
        {!isReadOnly ? (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : submitLabel}
          </Button>
        ) : null}
      </div>
    </form>
  )
}

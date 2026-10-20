import { ArrowLeftIcon, PencilIcon, RefreshCcwIcon } from "lucide-react"
import { useState } from "react"
import { FinancialMovementForm } from "~/features/financial-movements/components/financial-movement-form"
import { FINANCIAL_MOVEMENT_TYPES } from "~/features/financial-movements/constants"
import { Button } from "~/shared/components/ui/button"
import { formatMoney } from "~/shared/utils/money"
import { useMovementDraftDetail } from "./hooks/use-movement-draft-detail"

export function meta() {
  return [{ title: "Detalle de borrador financiero | Mype" }]
}

export default function MovementDraftDetailScreen() {
  const movementDetailState = useMovementDraftDetail()
  const [isEditing, setIsEditing] = useState(false)

  function startEditing(): void {
    setIsEditing(true)
  }

  function cancelEditing(): void {
    setIsEditing(false)
  }

  async function submitMovement(
    values: Parameters<typeof movementDetailState.submitMovement>[0],
  ): Promise<void> {
    await movementDetailState.submitMovement(values)
    setIsEditing(false)
  }

  if (movementDetailState.isLoading) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] p-8 text-center text-[#667085]">
        Cargando borrador...
      </main>
    )
  }

  return (
    <main className="min-h-screen min-w-80 bg-[#f5f7fb] px-3.5 py-6 text-[#172033] min-[641px]:px-6">
      <div className="mx-auto grid w-full max-w-[760px] gap-6">
        <header className="flex flex-col gap-4 min-[641px]:flex-row min-[641px]:items-end min-[641px]:justify-between">
          <div>
            <Button
              variant="ghost"
              className="mb-3 px-0 hover:bg-transparent cursor-pointer"
              onClick={movementDetailState.returnToMovements}
            >
              <ArrowLeftIcon data-icon="inline-end" aria-hidden="true" />
              Volver a borradores
            </Button>
            <span className="block text-xs font-extrabold tracking-[0.1em] text-[#2b5fce] uppercase">
              Operaciones
            </span>
            <h1 className="my-1 text-3xl font-bold tracking-[-0.035em] text-[#15233e]">
              Detalle del borrador
            </h1>
          </div>
          {movementDetailState.canUpdate &&
          movementDetailState.movement &&
          !isEditing ? (
            <Button type="button" onClick={startEditing}>
              <PencilIcon data-icon="inline-start" aria-hidden="true" />
              Editar cabecera
            </Button>
          ) : null}
        </header>

        {movementDetailState.error ? (
          <div
            role="alert"
            className="grid gap-3 rounded-2xl border border-[#f0c7cf] bg-[#fff5f6] p-4 text-[#9f243b]"
          >
            <span>{movementDetailState.error}</span>
            <Button
              type="button"
              variant="outline"
              onClick={movementDetailState.reloadMovement}
            >
              <RefreshCcwIcon data-icon="inline-start" aria-hidden="true" />
              Reintentar
            </Button>
          </div>
        ) : null}

        {movementDetailState.movement ? (
          <>
            <section className="grid gap-3 rounded-2xl border border-[#e1e6ef] bg-white p-5 shadow-sm min-[481px]:grid-cols-2">
              <div>
                <span className="text-xs font-bold text-[#748096] uppercase">
                  Estado
                </span>
                <p className="mt-1 mb-0 font-bold">Borrador</p>
              </div>
              <div>
                <span className="text-xs font-bold text-[#748096] uppercase">
                  Total
                </span>
                <p className="mt-1 mb-0 font-bold">
                  {formatMoney(
                    movementDetailState.movement.totalAmount,
                    movementDetailState.movement.currencyCode,
                  )}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold text-[#748096] uppercase">
                  Moneda
                </span>
                <p className="mt-1 mb-0 font-bold">
                  {movementDetailState.movement.currencyCode}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold text-[#748096] uppercase">
                  Versión
                </span>
                <p className="mt-1 mb-0 font-bold">
                  {movementDetailState.movement.version}
                </p>
              </div>
            </section>
            <FinancialMovementForm
              key={`${movementDetailState.movement.id}-${movementDetailState.movement.version}-${String(isEditing)}`}
              type={
                movementDetailState.movement.type ??
                FINANCIAL_MOVEMENT_TYPES.sale
              }
              defaultValues={{
                movementDate: movementDetailState.movement.movementDate,
                description: movementDetailState.movement.description ?? "",
              }}
              isSubmitting={movementDetailState.isSubmitting}
              isReadOnly={!isEditing}
              submitLabel="Guardar cambios"
              onSubmit={submitMovement}
              onCancel={
                isEditing
                  ? cancelEditing
                  : movementDetailState.returnToMovements
              }
            />
          </>
        ) : null}
      </div>
    </main>
  )
}

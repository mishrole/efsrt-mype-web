import { ArrowLeftIcon } from "lucide-react"
import { FinancialMovementForm } from "~/features/financial-movements/components/financial-movement-form"
import { FINANCIAL_MOVEMENT_TYPES } from "~/features/financial-movements/constants"
import { Button } from "~/shared/components/ui/button"
import { useMovementDraftCreate } from "./hooks/use-movement-draft-create"

export function meta() {
  return [{ title: "Nuevo borrador financiero | Mype" }]
}

export default function MovementDraftCreateScreen() {
  const movementCreateState = useMovementDraftCreate()

  if (!movementCreateState.type) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] p-8 text-center text-[#9f243b]">
        El tipo de movimiento solicitado no es válido.
      </main>
    )
  }

  const movementLabel =
    movementCreateState.type === FINANCIAL_MOVEMENT_TYPES.sale
      ? "venta"
      : "gasto"

  return (
    <main className="min-h-screen min-w-80 bg-[#f5f7fb] px-3.5 py-6 text-[#172033] min-[641px]:px-6">
      <div className="mx-auto grid w-full max-w-[760px] gap-6">
        <header>
          <Button
            variant="ghost"
            className="mb-3 px-0 hover:bg-transparent cursor-pointer"
            onClick={movementCreateState.returnToMovements}
          >
            <ArrowLeftIcon data-icon="inline-end" aria-hidden="true" />
            Volver a borradores
          </Button>
          <span className="block text-xs font-extrabold tracking-[0.1em] text-[#2b5fce] uppercase">
            Operaciones
          </span>
          <h1 className="my-1 text-3xl font-bold tracking-[-0.035em] text-[#15233e]">
            Nueva {movementLabel}
          </h1>
          <p className="m-0 text-[#667085]">
            Crea la cabecera del borrador para continuar completándolo.
          </p>
        </header>

        {movementCreateState.error ? (
          <div
            role="alert"
            className="rounded-2xl border border-[#f0c7cf] bg-[#fff5f6] p-4 text-[#9f243b]"
          >
            {movementCreateState.error}
          </div>
        ) : null}

        <FinancialMovementForm
          type={movementCreateState.type}
          isSubmitting={movementCreateState.isSubmitting}
          submitLabel="Crear borrador"
          onSubmit={movementCreateState.submitMovement}
          onCancel={movementCreateState.returnToMovements}
        />
      </div>
    </main>
  )
}

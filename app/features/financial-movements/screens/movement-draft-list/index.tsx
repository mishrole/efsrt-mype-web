import { ArrowLeftIcon, MinusIcon, PlusIcon } from "lucide-react"
import { Button } from "~/shared/components/ui/button"
import { MovementDraftCard } from "./components/movement-draft-card"
import { useMovementDrafts } from "./hooks/use-movement-drafts"

export function meta() {
  return [{ title: "Borradores financieros | Mype" }]
}

export default function MovementDraftListScreen() {
  const movementsState = useMovementDrafts()

  return (
    <main className="min-h-screen min-w-80 bg-[#f5f7fb] px-3.5 py-6 text-[#172033] min-[641px]:px-6">
      <div className="mx-auto grid w-full max-w-[1040px] gap-6">
        <header className="flex flex-col gap-4 min-[721px]:flex-row min-[721px]:items-end min-[721px]:justify-between">
          <div>
            <Button
              variant="ghost"
              className="mb-3 px-0 hover:bg-transparent cursor-pointer"
              onClick={movementsState.returnToFinancialMovements}
            >
              <ArrowLeftIcon data-icon="inline-end" aria-hidden="true" />
              Volver al movimientos
            </Button>
            <span className="block text-xs font-extrabold tracking-[0.1em] text-[#2b5fce] uppercase">
              Operaciones
            </span>
            <h1 className="my-1 text-3xl font-bold tracking-[-0.035em] text-[#15233e]">
              Borradores financieros
            </h1>
            <p className="m-0 text-[#667085]">
              Movimientos de ventas y gastos pendientes de confirmación
            </p>
          </div>
          {movementsState.canCreate ? (
            <div className="flex w-full flex-col gap-2 min-[481px]:w-auto min-[481px]:flex-row">
              <Button type="button" onClick={movementsState.createSale}>
                <PlusIcon data-icon="inline-start" aria-hidden="true" />
                Nueva venta
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={movementsState.createExpense}
              >
                <MinusIcon data-icon="inline-start" aria-hidden="true" />
                Nuevo gasto
              </Button>
            </div>
          ) : null}
        </header>

        {movementsState.error ? (
          <div
            role="alert"
            className="rounded-2xl border border-[#f0c7cf] bg-[#fff5f6] p-4 text-[#9f243b]"
          >
            {movementsState.error}
          </div>
        ) : null}

        {movementsState.isLoading ? (
          <p className="m-0 rounded-2xl border border-[#e1e6ef] bg-white p-6 text-center text-[#667085]">
            Cargando borradores...
          </p>
        ) : null}

        {!movementsState.isLoading &&
        !movementsState.error &&
        movementsState.movements.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-[#b8c7e5] bg-white p-8 text-center">
            <h2 className="m-0 text-xl">No hay borradores pendientes</h2>
            <p className="mt-2 mb-0 text-[#667085]">
              Crea una venta o un gasto para comenzar.
            </p>
          </section>
        ) : null}

        {!movementsState.isLoading && movementsState.movements.length > 0 ? (
          <section
            className="grid gap-3"
            aria-label="Listado de borradores financieros"
          >
            {movementsState.movements.map((movement) => (
              <MovementDraftCard
                key={movement.id}
                movement={movement}
                onView={movementsState.viewMovement}
              />
            ))}
          </section>
        ) : null}
      </div>
    </main>
  )
}

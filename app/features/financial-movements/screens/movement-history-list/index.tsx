import { ArrowLeftIcon, FileClockIcon } from "lucide-react"
import { Button } from "~/shared/components/ui/button"
import { MovementHistoryCard } from "./components/movement-history-card"
import { MovementHistoryFilters } from "./components/movement-history-filters"
import { MovementHistoryPagination } from "./components/movement-history-pagination"
import { useMovementHistory } from "./hooks/use-movement-history"

export function meta() {
  return [{ title: "Historial financiero | Mype" }]
}

export default function MovementHistoryListScreen() {
  const historyState = useMovementHistory()

  return (
    <main className="min-h-screen min-w-80 bg-[#f5f7fb] px-3.5 py-6 text-[#172033] min-[641px]:px-6">
      <div className="mx-auto grid w-full max-w-[1180px] gap-6">
        <header className="flex flex-col gap-4 min-[721px]:flex-row min-[721px]:items-end min-[721px]:justify-between">
          <div>
            <Button
              variant="ghost"
              className="mb-3 cursor-pointer px-0 hover:bg-transparent"
              onClick={historyState.returnToDashboard}
            >
              <ArrowLeftIcon data-icon="inline-end" aria-hidden="true" />
              Volver al dashboard
            </Button>
            <span className="block text-xs font-extrabold tracking-[0.1em] text-[#2b5fce] uppercase">
              Operaciones
            </span>
            <h1 className="my-1 text-3xl font-bold tracking-[-0.035em] text-[#15233e]">
              Historial financiero
            </h1>
            <p className="m-0 text-[#667085]">
              Consulta y filtra las ventas y los gastos registrados
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={historyState.viewDrafts}
          >
            <FileClockIcon data-icon="inline-start" aria-hidden="true" />
            Ver borradores
          </Button>
        </header>

        <MovementHistoryFilters
          values={historyState.filters}
          categories={historyState.categories}
          disabled={historyState.isLoading}
          onChange={historyState.setFilters}
          onApply={historyState.applyFilters}
          onClear={historyState.clearFilters}
        />

        {historyState.error ? (
          <div
            role="alert"
            className="rounded-2xl border border-[#f0c7cf] bg-[#fff5f6] p-4 text-[#9f243b]"
          >
            {historyState.error}
          </div>
        ) : null}

        {historyState.isLoading ? (
          <p className="m-0 rounded-2xl border border-[#e1e6ef] bg-white p-6 text-center text-[#667085]">
            Cargando historial...
          </p>
        ) : null}

        {!historyState.isLoading &&
        !historyState.error &&
        historyState.movements.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-[#b8c7e5] bg-white p-8 text-center">
            <h2 className="m-0 text-xl">No hay movimientos para mostrar</h2>
            <p className="mt-2 mb-0 text-[#667085]">
              Ajusta los filtros o consulta nuevamente cuando existan
              operaciones.
            </p>
          </section>
        ) : null}

        {!historyState.isLoading && historyState.movements.length > 0 ? (
          <section
            className="grid gap-3"
            aria-label="Listado del historial financiero"
          >
            {historyState.movements.map((movement) => (
              <MovementHistoryCard
                key={movement.id}
                movement={movement}
                onView={historyState.viewMovement}
              />
            ))}
          </section>
        ) : null}

        {!historyState.isLoading &&
        !historyState.error &&
        historyState.totalCount > 0 ? (
          <MovementHistoryPagination
            page={historyState.page}
            pageSize={historyState.pageSize}
            totalCount={historyState.totalCount}
            hasPreviousPage={historyState.hasPreviousPage}
            hasNextPage={historyState.hasNextPage}
            onPreviousPage={historyState.goToPreviousPage}
            onNextPage={historyState.goToNextPage}
          />
        ) : null}
      </div>
    </main>
  )
}

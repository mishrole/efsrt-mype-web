import { ArrowLeftIcon } from "lucide-react"
import MovementDraftDetailScreen from "~/features/financial-movements/screens/movement-draft-detail"
import { FinancialMovementStatus } from "~/services/financial-movements/list-financial-movement-history/interfaces"
import { Button } from "~/shared/components/ui/button"
import { MovementHistoryDetailEvidences } from "./components/movement-history-detail-evidences"
import { MovementHistoryDetailItems } from "./components/movement-history-detail-items"
import { MovementHistoryDetailSummary } from "./components/movement-history-detail-summary"
import { useMovementHistoryDetail } from "./hooks/use-movement-history-detail"

export function meta() {
  return [{ title: "Detalle del movimiento | Mype" }]
}

export default function MovementHistoryDetailScreen() {
  const detailState = useMovementHistoryDetail()

  if (detailState.isLoading) {
    return (
      <main className="grid min-h-[60vh] place-items-center px-4">
        <p>Cargando movimiento...</p>
      </main>
    )
  }

  if (detailState.error || !detailState.movement) {
    return (
      <main className="min-h-screen min-w-80 bg-[#f5f7fb] px-3.5 py-6 text-[#172033] min-[641px]:px-6">
        <div className="mx-auto grid w-full max-w-[760px] gap-4">
          <Button
            variant="ghost"
            className="w-fit cursor-pointer px-0 hover:bg-transparent"
            onClick={detailState.returnToHistory}
          >
            <ArrowLeftIcon data-icon="inline-end" aria-hidden="true" />
            Volver al historial
          </Button>
          <div
            role="alert"
            className="rounded-2xl border border-[#f0c7cf] bg-[#fff5f6] p-4 text-[#9f243b]"
          >
            {detailState.error || "No se encontró el movimiento."}
          </div>
        </div>
      </main>
    )
  }

  if (detailState.movement.status === FinancialMovementStatus.Draft) {
    return <MovementDraftDetailScreen />
  }

  return (
    <main className="min-h-screen min-w-80 bg-[#f5f7fb] px-3.5 py-6 text-[#172033] min-[641px]:px-6">
      <div className="mx-auto grid w-full max-w-[900px] gap-6">
        <header>
          <Button
            variant="ghost"
            className="mb-3 cursor-pointer px-0 hover:bg-transparent"
            onClick={detailState.returnToHistory}
          >
            <ArrowLeftIcon data-icon="inline-end" aria-hidden="true" />
            Volver al historial
          </Button>
          <span className="block text-xs font-extrabold tracking-[0.1em] text-[#2b5fce] uppercase">
            Operaciones
          </span>
          <h1 className="my-1 text-3xl font-bold tracking-[-0.035em] text-[#15233e]">
            Detalle del movimiento
          </h1>
          <p className="m-0 text-[#667085]">
            Consulta histórica de solo lectura
          </p>
        </header>

        <MovementHistoryDetailSummary movement={detailState.movement} />
        <MovementHistoryDetailItems
          items={detailState.movement.items}
          currencyCode={detailState.movement.currencyCode}
        />
        <MovementHistoryDetailEvidences
          evidences={detailState.movement.evidences}
        />
      </div>
    </main>
  )
}

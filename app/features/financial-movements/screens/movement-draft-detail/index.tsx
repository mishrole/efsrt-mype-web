import { ArrowLeftIcon, CheckCircle2Icon, PencilIcon } from "lucide-react"
import { useState } from "react"
import { ConfirmFinancialMovementDialog } from "~/features/financial-movements/components/confirm-financial-movement-dialog"
import { FinancialMovementForm } from "~/features/financial-movements/components/financial-movement-form"
import { FINANCIAL_MOVEMENT_TYPES } from "~/features/financial-movements/constants"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/shared/components/ui/accordion"
import { Button } from "~/shared/components/ui/button"
import { formatMoney } from "~/shared/utils/money"
import { MovementEvidencesPanel } from "./components/movement-evidences-panel"
import { MovementItemsPanel } from "./components/movement-items-panel"
import { useMovementDraftDetail } from "./hooks/use-movement-draft-detail"

const OPEN_SECTIONS = ["header", "items", "evidences"]
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
  if (movementDetailState.isLoading)
    return (
      <main className="grid min-h-[60vh] place-items-center px-4">
        <p>Cargando borrador...</p>
      </main>
    )
  return (
    <main className="min-h-screen min-w-80 bg-[#f5f7fb] px-3.5 py-6 text-[#172033] min-[641px]:px-6">
      <div className="mx-auto grid w-full max-w-[760px] gap-6">
        <header className="flex flex-col gap-4 min-[641px]:flex-row min-[641px]:items-end min-[641px]:justify-between">
          <div className="flex flex-col items-start">
            <Button
              variant="ghost"
              className="mb-3 px-0 hover:bg-transparent cursor-pointer"
              onClick={movementDetailState.returnToMovements}
            >
              <ArrowLeftIcon data-icon="inline-end" aria-hidden="true" />
              Volver a productos
            </Button>
            <div>
              <p className="m-0 text-sm font-bold text-[#2458d1]">
                Movimiento financiero
              </p>
              <h1 className="m-0 text-2xl font-black text-[#172641]">
                Detalle del borrador
              </h1>
            </div>
          </div>
          {movementDetailState.canConfirm ? (
            <Button
              type="button"
              disabled={
                movementDetailState.isConfirming ||
                movementDetailState.itemVersions.length === 0
              }
              onClick={movementDetailState.openConfirmDialog}
            >
              <CheckCircle2Icon data-icon="inline-start" aria-hidden="true" />
              Confirmar movimiento
            </Button>
          ) : null}
        </header>
        {movementDetailState.error ? (
          <div
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-destructive"
          >
            {movementDetailState.error}
          </div>
        ) : null}
        {movementDetailState.movement ? (
          <>
            <section className="grid gap-4 rounded-2xl border border-[#e1e6ef] bg-white p-5 shadow-sm min-[641px]:grid-cols-3">
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
                <p className="mt-1 mb-0 text-xl font-black">
                  {formatMoney(
                    movementDetailState.movement.totalAmount,
                    movementDetailState.movement.currencyCode,
                  )}
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
            <Accordion
              multiple
              defaultValue={OPEN_SECTIONS}
              className="gap-0 border-[#e1e6ef] bg-white"
            >
              <AccordionItem
                value="header"
                className="bg-white data-open:bg-white"
              >
                <AccordionTrigger className="w-full">Cabecera</AccordionTrigger>
                <AccordionContent className="bg-white">
                  {movementDetailState.canUpdate && !isEditing ? (
                    <div className="mb-4 flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={startEditing}
                      >
                        <PencilIcon
                          data-icon="inline-start"
                          aria-hidden="true"
                        />
                        Editar cabecera
                      </Button>
                    </div>
                  ) : null}
                  <FinancialMovementForm
                    key={`${movementDetailState.movement.id}-${movementDetailState.movement.version}-${String(isEditing)}`}
                    type={
                      movementDetailState.movement.type ??
                      FINANCIAL_MOVEMENT_TYPES.sale
                    }
                    defaultValues={{
                      movementDate: movementDetailState.movement.movementDate,
                      description:
                        movementDetailState.movement.description ?? "",
                    }}
                    isSubmitting={movementDetailState.isSubmitting}
                    isReadOnly={!isEditing}
                    submitLabel="Guardar cambios"
                    onSubmit={submitMovement}
                    onCancel={cancelEditing}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="items"
                className="bg-white data-open:bg-white"
              >
                <AccordionTrigger className="w-full">Ítems</AccordionTrigger>
                <AccordionContent className="bg-white">
                  <MovementItemsPanel
                    businessId={movementDetailState.movement.businessId}
                    movementId={movementDetailState.movement.id}
                    movementType={movementDetailState.movement.type}
                    movementVersion={movementDetailState.movement.version}
                    currencyCode={movementDetailState.movement.currencyCode}
                    onMovementChanged={movementDetailState.applyMovementSummary}
                    onItemsChanged={movementDetailState.applyMovementItems}
                    showHeading={false}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="evidences"
                className="bg-white data-open:bg-white"
              >
                <AccordionTrigger className="w-full">
                  Evidencias
                </AccordionTrigger>
                <AccordionContent className="bg-white">
                  <MovementEvidencesPanel
                    businessId={movementDetailState.movement.businessId}
                    movementId={movementDetailState.movement.id}
                    movementVersion={movementDetailState.movement.version}
                    onMovementChanged={movementDetailState.reloadMovement}
                    showHeading={false}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <ConfirmFinancialMovementDialog
              isOpen={movementDetailState.isConfirmDialogOpen}
              isConfirming={movementDetailState.isConfirming}
              movementType={movementDetailState.movement.type}
              movementDate={movementDetailState.movement.movementDate}
              totalAmount={movementDetailState.movement.totalAmount}
              currencyCode={movementDetailState.movement.currencyCode}
              itemCount={movementDetailState.itemVersions.length}
              onCancel={movementDetailState.closeConfirmDialog}
              onConfirm={movementDetailState.confirmMovement}
            />
          </>
        ) : null}
      </div>
    </main>
  )
}

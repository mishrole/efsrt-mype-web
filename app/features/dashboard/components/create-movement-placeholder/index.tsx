import { Modal } from "~/shared/components/modal"
import type { CreateMovementPlaceholderProps } from "./interfaces"

export function CreateMovementPlaceholder({
  open,
  onClose,
}: Readonly<CreateMovementPlaceholderProps>) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar movimiento"
      description="El flujo de ventas y gastos se conectará en el siguiente incremento."
    >
      <div className="flex items-center gap-3.5 rounded-[14px] border border-dashed border-[#9eb7ed] bg-[#f5f8ff] p-[22px]">
        <span
          className="grid size-10 flex-none place-items-center rounded-full bg-[#2458d1] text-[1.4rem] text-white"
          aria-hidden="true"
        >
          +
        </span>
        <p className="m-0 text-[#56647c]">
          Elige venta o gasto cuando el módulo de movimientos esté disponible.
        </p>
      </div>
    </Modal>
  )
}

import { Modal } from "~/shared/components/modal"
import { Button } from "~/shared/components/ui/button"
import type { ProductStatusDialogProps } from "./interfaces"

export function ProductStatusDialog({
  product,
  isSubmitting,
  onClose,
  onConfirm,
}: Readonly<ProductStatusDialogProps>) {
  const actionLabel = product?.isActive ? "Desactivar" : "Reactivar"

  function handleConfirm(): void {
    void onConfirm()
  }

  return (
    <Modal
      open={product !== null}
      title={`${actionLabel} producto`}
      description={
        product?.isActive
          ? "El producto dejará de estar disponible para nuevas ventas."
          : "El producto volverá a estar disponible para nuevas ventas."
      }
      onClose={onClose}
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant={product?.isActive ? "destructive" : "default"}
            disabled={isSubmitting}
            onClick={handleConfirm}
          >
            {isSubmitting ? "Procesando..." : actionLabel}
          </Button>
        </>
      }
    >
      <p className="m-0 text-[#44516a]">
        ¿Confirmas que deseas {actionLabel.toLowerCase()} el producto{" "}
        <strong>{product?.name}</strong>?
      </p>
    </Modal>
  )
}

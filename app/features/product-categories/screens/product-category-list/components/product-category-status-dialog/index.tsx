import { Modal } from "~/shared/components/modal"
import { Button } from "~/shared/components/ui/button"
import type { ProductCategoryStatusDialogProps } from "./interfaces"

export function ProductCategoryStatusDialog({
  category,
  isSubmitting,
  onClose,
  onConfirm,
}: Readonly<ProductCategoryStatusDialogProps>) {
  const actionLabel = category?.isActive ? "Desactivar" : "Reactivar"
  const description = category?.isActive
    ? "La categoría dejará de estar disponible para nuevas selecciones de productos."
    : "La categoría volverá a estar disponible para seleccionar en productos."

  function handleConfirm(): void {
    void onConfirm()
  }

  return (
    <Modal
      open={category !== null}
      title={`${actionLabel} categoría`}
      description={description}
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
          <Button type="button" disabled={isSubmitting} onClick={handleConfirm}>
            {isSubmitting ? "Procesando..." : actionLabel}
          </Button>
        </>
      }
    >
      <p className="m-0 text-[#44516a]">
        ¿Confirmas que deseas {actionLabel.toLowerCase()} la categoría{" "}
        <strong>{category?.name}</strong>?
      </p>
    </Modal>
  )
}

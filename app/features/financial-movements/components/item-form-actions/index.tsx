import { Button } from "~/shared/components/ui/button"
import type { ItemFormActionsProps } from "./interfaces"

export function ItemFormActions({
  isEditing,
  isSubmitting,
  createLabel,
  onCancel,
}: Readonly<ItemFormActionsProps>) {
  function getSubmitLabel(): string {
    if (isSubmitting) {
      return "Guardando..."
    }

    return isEditing ? "Guardar cambios" : createLabel
  }

  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="ghost" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {getSubmitLabel()}
      </Button>
    </div>
  )
}

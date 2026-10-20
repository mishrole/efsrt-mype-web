import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "~/shared/components/ui/button"
import { Input } from "~/shared/components/ui/input"
import { Textarea } from "~/shared/components/ui/textarea"
import type { ExpenseItemFormProps } from "./interfaces"
import { expenseItemFormSchema, type ExpenseItemFormValues } from "./schema"

export function ExpenseItemForm({
  categories,
  item,
  isSubmitting,
  onSubmit,
  onCancel,
}: Readonly<ExpenseItemFormProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseItemFormValues>({
    resolver: zodResolver(expenseItemFormSchema),
    defaultValues: {
      categoryId: item?.categoryId ?? "",
      description: item?.description ?? "",
      quantity: item?.quantity ?? 1,
      unitAmount: item?.unitAmount ?? 0,
    },
  })
  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label className="grid gap-2">
        <span>Categoría de gasto</span>
        <select
          className="h-10 rounded-md border px-3"
          disabled={isSubmitting}
          {...register("categoryId")}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <span className="text-sm text-destructive">
          {errors.categoryId?.message}
        </span>
      </label>
      <label className="grid gap-2">
        <span>Descripción</span>
        <Textarea disabled={isSubmitting} {...register("description")} />
        <span className="text-sm text-destructive">
          {errors.description?.message}
        </span>
      </label>
      <label className="grid gap-2">
        <span>Cantidad</span>
        <Input
          type="number"
          step="0.01"
          disabled={isSubmitting}
          {...register("quantity", { valueAsNumber: true })}
        />
        <span className="text-sm text-destructive">
          {errors.quantity?.message}
        </span>
      </label>
      <label className="grid gap-2">
        <span>Importe unitario</span>
        <Input
          type="number"
          step="0.01"
          disabled={isSubmitting}
          {...register("unitAmount", { valueAsNumber: true })}
        />
        <span className="text-sm text-destructive">
          {errors.unitAmount?.message}
        </span>
      </label>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Guardando..."
            : item
              ? "Guardar cambios"
              : "Agregar concepto"}
        </Button>
      </div>
    </form>
  )
}

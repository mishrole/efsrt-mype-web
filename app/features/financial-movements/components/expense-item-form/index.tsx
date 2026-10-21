import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ItemFormActions } from "~/features/financial-movements/components/item-form-actions"
import { ItemFormNumberFields } from "~/features/financial-movements/components/item-form-number-fields"
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
      <ItemFormNumberFields
        quantityInput={
          <Input
            type="number"
            step="0.01"
            disabled={isSubmitting}
            {...register("quantity", { valueAsNumber: true })}
          />
        }
        quantityError={errors.quantity?.message}
        unitAmountInput={
          <Input
            type="number"
            step="0.01"
            disabled={isSubmitting}
            {...register("unitAmount", { valueAsNumber: true })}
          />
        }
        unitAmountError={errors.unitAmount?.message}
      />
      <ItemFormActions
        isEditing={item !== null}
        isSubmitting={isSubmitting}
        createLabel="Agregar concepto"
        onCancel={onCancel}
      />
    </form>
  )
}

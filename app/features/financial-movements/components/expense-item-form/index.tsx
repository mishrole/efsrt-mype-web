import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { ItemFormActions } from "~/features/financial-movements/components/item-form-actions"
import { ItemFormNumberFields } from "~/features/financial-movements/components/item-form-number-fields"
import { Input } from "~/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select"
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
    control,
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
        <span className="text-[0.9rem] font-[750] text-[#27324a]">
          Categoría de gasto
        </span>

        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => {
            const selectedCategoryName = categories.find(
              (category) => category.id === field.value,
            )?.name

            return (
              <Select
                value={field.value}
                disabled={isSubmitting}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  className={[
                    "min-h-12 w-full rounded-xl border-[#cfd6e4] bg-white px-4 text-base text-[#172033]",
                    "focus-visible:border-[#3569e8] focus-visible:ring-[#3569e8]/12",
                    "aria-invalid:border-[#c73c54] aria-invalid:ring-[#c73c54]/12",
                  ].join(" ")}
                  aria-invalid={Boolean(errors.categoryId)}
                  onBlur={field.onBlur}
                >
                  <SelectValue>
                    {selectedCategoryName ?? "Selecciona una categoría"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent align="start" alignItemWithTrigger={false}>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }}
        />

        {errors.categoryId?.message ? (
          <p className="m-0 text-[0.78rem] leading-6 text-[#b3263e]">
            {errors.categoryId.message}
          </p>
        ) : null}
      </label>
      <label className="grid gap-2">
        <span>Descripción</span>
        <Textarea
          className="min-h-12 rounded-xl border-[#d9e0ec] bg-white px-3 py-3"
          disabled={isSubmitting}
          {...register("description")}
        />
        <span className="text-sm text-destructive">
          {errors.description?.message}
        </span>
      </label>
      <ItemFormNumberFields
        quantityInput={
          <Input
            className="min-h-12 rounded-xl border-[#d9e0ec] bg-white px-3 py-3"
            type="number"
            step="0.01"
            disabled={isSubmitting}
            {...register("quantity", { valueAsNumber: true })}
          />
        }
        quantityError={errors.quantity?.message}
        unitAmountInput={
          <Input
            className="min-h-12 rounded-xl border-[#d9e0ec] bg-white px-3 py-3"
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

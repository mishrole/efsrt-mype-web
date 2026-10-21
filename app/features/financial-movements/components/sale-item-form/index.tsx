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
import type { SaleItemFormProps } from "./interfaces"
import { saleItemFormSchema, type SaleItemFormValues } from "./schema"

export function SaleItemForm({
  products,
  item,
  isSubmitting,
  onSubmit,
  onCancel,
}: Readonly<SaleItemFormProps>) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SaleItemFormValues>({
    resolver: zodResolver(saleItemFormSchema),
    defaultValues: {
      productId: item?.productId ?? "",
      quantity: item?.quantity ?? 1,
      unitAmount: item?.unitAmount ?? 0,
    },
  })
  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label className="grid gap-2">
        <span className="text-[0.9rem] font-[750] text-[#27324a]">
          Producto
        </span>

        <Controller
          name="productId"
          control={control}
          render={({ field }) => {
            const selectedProductName = products.find(
              (product) => product.id === field.value,
            )?.name

            return (
              <Select
                value={field.value}
                disabled={isSubmitting}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  className={[
                    "min-h-[3.25rem] w-full rounded-[0.875rem] border-[#cfd6e4] bg-white px-4 text-base text-[#172033]",
                    "focus-visible:border-[#3569e8] focus-visible:ring-[#3569e8]/12",
                    "aria-invalid:border-[#c73c54] aria-invalid:ring-[#c73c54]/12",
                  ].join(" ")}
                  aria-invalid={Boolean(errors.productId)}
                  onBlur={field.onBlur}
                >
                  <SelectValue>
                    {selectedProductName ?? "Selecciona un producto"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent align="start" alignItemWithTrigger={false}>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }}
        />

        {errors.productId?.message ? (
          <p className="m-0 text-[0.78rem] leading-6 text-[#b3263e]">
            {errors.productId.message}
          </p>
        ) : null}
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
        createLabel="Agregar producto"
        onCancel={onCancel}
      />
    </form>
  )
}

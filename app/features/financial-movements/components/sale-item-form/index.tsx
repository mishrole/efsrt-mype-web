import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ItemFormActions } from "~/features/financial-movements/components/item-form-actions"
import { ItemFormNumberFields } from "~/features/financial-movements/components/item-form-number-fields"
import { Input } from "~/shared/components/ui/input"
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
        <span>Producto</span>
        <select
          className="h-10 rounded-md border px-3"
          disabled={isSubmitting}
          {...register("productId")}
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <span className="text-sm text-destructive">
          {errors.productId?.message}
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
        createLabel="Agregar producto"
        onCancel={onCancel}
      />
    </form>
  )
}

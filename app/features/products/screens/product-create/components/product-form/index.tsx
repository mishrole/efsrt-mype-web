import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Button } from "~/shared/components/ui/button"
import { Input } from "~/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select"
import type { ProductFormProps, ProductFormValues } from "./interfaces"
import { productFormSchema } from "./schema"

const DEFAULT_VALUES: ProductFormValues = {
  name: "",
  categoryId: "",
  salePrice: 0,
  unitCost: 0,
}

export function ProductForm({
  categories,
  isSubmitting,
  onSubmit,
  onCancel,
}: Readonly<ProductFormProps>) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: DEFAULT_VALUES,
  })

  function submitForm(values: ProductFormValues): Promise<void> {
    return onSubmit(values)
  }

  return (
    <form
      className="grid gap-5 rounded-2xl border border-[#e1e6ef] bg-white p-5 shadow-sm min-[641px]:p-6"
      onSubmit={handleSubmit(submitForm)}
      noValidate
    >
      <label className="grid gap-2">
        <span className="text-sm font-bold text-[#27324a]">Nombre</span>
        <Input
          className="min-h-12 rounded-xl border-[#cfd6e4] bg-white px-4"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "product-name-error" : undefined}
          {...register("name")}
        />
        {errors.name ? (
          <span id="product-name-error" className="text-sm text-[#b3263e]">
            {errors.name.message}
          </span>
        ) : null}
      </label>

      <div className="grid gap-2">
        <span className="text-sm font-bold text-[#27324a]">Categoría</span>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select
              value={field.value || null}
              onValueChange={field.onChange}
              disabled={isSubmitting}
            >
              <SelectTrigger
                aria-label="Categoría"
                aria-invalid={Boolean(errors.categoryId)}
                aria-describedby={
                  errors.categoryId ? "product-category-error" : undefined
                }
                className="min-h-12 w-full rounded-xl border-[#cfd6e4] bg-white px-4"
              >
                <SelectValue>
                  {categories.find((category) => category.id === field.value)
                    ?.name ?? "Seleccionar categoría"}
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
          )}
        />
        {errors.categoryId ? (
          <span id="product-category-error" className="text-sm text-[#b3263e]">
            {errors.categoryId.message}
          </span>
        ) : null}
      </div>

      <div className="grid gap-4 min-[641px]:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-[#27324a]">
            Precio de venta
          </span>
          <Input
            type="number"
            min="0"
            step="0.01"
            className="min-h-12 rounded-xl border-[#cfd6e4] bg-white px-4"
            aria-invalid={Boolean(errors.salePrice)}
            aria-describedby={
              errors.salePrice ? "product-sale-price-error" : undefined
            }
            {...register("salePrice", { valueAsNumber: true })}
          />
          {errors.salePrice ? (
            <span
              id="product-sale-price-error"
              className="text-sm text-[#b3263e]"
            >
              {errors.salePrice.message}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-[#27324a]">
            Coste unitario referencial
          </span>
          <Input
            type="number"
            min="0"
            step="0.01"
            className="min-h-12 rounded-xl border-[#cfd6e4] bg-white px-4"
            aria-invalid={Boolean(errors.unitCost)}
            aria-describedby={
              errors.unitCost ? "product-unit-cost-error" : undefined
            }
            {...register("unitCost", { valueAsNumber: true })}
          />
          {errors.unitCost ? (
            <span
              id="product-unit-cost-error"
              className="text-sm text-[#b3263e]"
            >
              {errors.unitCost.message}
            </span>
          ) : null}
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[#e5eaf2] pt-5 min-[481px]:flex-row min-[481px]:justify-end">
        <Button
          type="button"
          variant="ghost"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Crear producto"}
        </Button>
      </div>
    </form>
  )
}

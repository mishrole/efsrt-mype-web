import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { Button } from "~/shared/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/shared/components/ui/combobox"
import { Input } from "~/shared/components/ui/input"
import { INITIAL_VALUES } from "./constants"
import type {
  ProductCategoryComboboxItem,
  ProductFormProps,
  ProductFormValues,
} from "./interfaces"
import { productFormSchema } from "./schema"

export function ProductForm({
  productCategories,
  defaultValues,
  isSubmitting,
  isReadOnly = false,
  submitLabel,
  onSubmit,
  onCancel,
}: Readonly<ProductFormProps>) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues ?? INITIAL_VALUES,
  })

  const productCategoryItems: ProductCategoryComboboxItem[] =
    productCategories.map((productCategory) => ({
      label: productCategory.name,
      value: productCategory.id,
    }))
  const selectedProductCategoryId = useWatch({
    control,
    name: "productCategoryId",
  })
  const selectedProductCategory =
    productCategoryItems.find(
      (productCategoryItem) =>
        productCategoryItem.value === selectedProductCategoryId,
    ) ?? null

  function handleProductCategoryChange(
    productCategoryItem: ProductCategoryComboboxItem | null,
  ): void {
    setValue("productCategoryId", productCategoryItem?.value ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  return (
    <form
      className="grid gap-6 rounded-2xl border border-[#e1e6ef] bg-white p-5 shadow-sm min-[641px]:p-7"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <label className="grid gap-2">
        <span className="text-sm font-bold text-[#27324a]">Nombre</span>
        <Input
          maxLength={160}
          disabled={isSubmitting || isReadOnly}
          aria-invalid={Boolean(errors.name)}
          className="h-10 rounded-xl border-[#d9e0ec] bg-white"
          {...register("name")}
        />
        <span className="min-h-5 text-sm text-[#b3263e]">
          {errors.name?.message}
        </span>
      </label>

      <div className="grid gap-2">
        <span className="text-sm font-bold text-[#27324a]">
          Categoría de producto
        </span>
        <Combobox
          items={productCategoryItems}
          value={selectedProductCategory}
          onValueChange={handleProductCategoryChange}
          disabled={isSubmitting || isReadOnly}
        >
          <ComboboxInput
            className="min-h-12 w-full rounded-xl border-[#cfd6e4] bg-white"
            placeholder="Selecciona o busca una categoría"
            aria-label="Categoría de producto"
            disabled={isSubmitting || isReadOnly}
            showTrigger={!isReadOnly}
            showClear={!isReadOnly}
          />
          <ComboboxContent>
            <ComboboxEmpty>No se encontraron categorías.</ComboboxEmpty>
            <ComboboxList>
              {(productCategoryItem: ProductCategoryComboboxItem) => (
                <ComboboxItem
                  key={productCategoryItem.value}
                  value={productCategoryItem}
                >
                  {productCategoryItem.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <span className="min-h-5 text-sm text-[#b3263e]">
          {errors.productCategoryId?.message}
        </span>
      </div>

      <div className="grid gap-5 min-[641px]:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-[#27324a]">
            Precio de venta
          </span>
          <Input
            type="number"
            min="0"
            step="0.01"
            disabled={isSubmitting || isReadOnly}
            aria-invalid={Boolean(errors.salePrice)}
            className="h-10 rounded-xl border-[#d9e0ec] bg-white"
            {...register("salePrice", { valueAsNumber: true })}
          />
          <span className="min-h-5 text-sm text-[#b3263e]">
            {errors.salePrice?.message}
          </span>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-[#27324a]">
            Coste unitario referencial
          </span>
          <Input
            type="number"
            min="0"
            step="0.01"
            disabled={isSubmitting || isReadOnly}
            aria-invalid={Boolean(errors.unitCost)}
            className="h-10 rounded-xl border-[#d9e0ec] bg-white"
            {...register("unitCost", { valueAsNumber: true })}
          />
          <span className="min-h-5 text-sm text-[#b3263e]">
            {errors.unitCost?.message}
          </span>
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
        {!isReadOnly ? (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : submitLabel}
          </Button>
        ) : null}
      </div>
    </form>
  )
}

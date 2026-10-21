import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { Button } from "~/shared/components/ui/button"
import { Input } from "~/shared/components/ui/input"
import { PRODUCT_CATEGORY_NEUTRAL_COLOR } from "../../constants"
import { ProductCategoryColorPicker } from "../product-category-color-picker"
import type { ProductCategoryFormProps } from "./interfaces"
import {
  productCategoryFormSchema,
  type ProductCategoryFormValues,
} from "./schema"

export function ProductCategoryForm({
  defaultValues,
  isSubmitting,
  submitLabel,
  onSubmit,
  onCancel,
}: Readonly<ProductCategoryFormProps>) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductCategoryFormValues>({
    resolver: zodResolver(productCategoryFormSchema),
    defaultValues: defaultValues ?? {
      name: "",
      color: PRODUCT_CATEGORY_NEUTRAL_COLOR,
    },
  })
  const selectedColor = useWatch({
    control,
    name: "color",
  })

  function handleColorChange(color: string): void {
    setValue("color", color, {
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
          maxLength={120}
          className="min-h-12 rounded-xl border-[#d9e0ec] bg-white px-3 py-3"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        <span className="min-h-5 text-sm text-[#b3263e]">
          {errors.name?.message}
        </span>
      </label>

      <div className="grid gap-2">
        <ProductCategoryColorPicker
          value={selectedColor}
          onChange={handleColorChange}
          disabled={isSubmitting}
        />
        <span className="min-h-5 text-sm text-[#b3263e]">
          {errors.color?.message}
        </span>
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
          {isSubmitting ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}

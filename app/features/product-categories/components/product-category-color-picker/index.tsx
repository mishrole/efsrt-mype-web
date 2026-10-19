import {
  PRODUCT_CATEGORY_COLORS,
  PRODUCT_CATEGORY_NEUTRAL_COLOR,
} from "../../constants"
interface Props {
  value: string
  onChange: (color: string) => void
  disabled?: boolean
}
export function ProductCategoryColorPicker({
  value,
  onChange,
  disabled = false,
}: Readonly<Props>) {
  const colors = [PRODUCT_CATEGORY_NEUTRAL_COLOR, ...PRODUCT_CATEGORY_COLORS]
  return (
    <fieldset disabled={disabled} className="grid gap-2">
      <legend className="text-sm font-bold">Color</legend>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Seleccionar color ${color}`}
            aria-pressed={value === color}
            onClick={() => onChange(color)}
            className="size-9 rounded-full border-2 border-white shadow ring-offset-2 aria-pressed:ring-2 aria-pressed:ring-[#2458d1]"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      {/* <input
        aria-label="Color personalizado"
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value.toUpperCase())}
      /> */}
    </fieldset>
  )
}

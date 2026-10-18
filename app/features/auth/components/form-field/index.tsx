import { Input } from "~/shared/components/ui/input"
import type { FormFieldProps } from "./interfaces"

export function FormField({
  id,
  label,
  error,
  className,
  ...inputProps
}: Readonly<FormFieldProps>) {
  const errorId = `${id}-error`

  return (
    <div className="grid gap-2">
      <label className="text-[0.9rem] font-[750] text-[#27324a]" htmlFor={id}>
        {label}
      </label>

      <Input
        {...inputProps}
        id={id}
        className={[
          "min-h-[3.25rem] rounded-[0.875rem] border-[#cfd6e4] bg-white px-4 text-base text-[#172033]",
          "focus-visible:border-[#3569e8] focus-visible:ring-[#3569e8]/12",
          "aria-invalid:border-[#c73c54] aria-invalid:ring-[#c73c54]/12",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />

      {error ? (
        <p id={errorId} className="m-0 text-[0.78rem] leading-6 text-[#b3263e]">
          {error}
        </p>
      ) : null}
    </div>
  )
}

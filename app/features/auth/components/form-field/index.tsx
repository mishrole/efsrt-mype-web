import type { FormFieldProps } from "./interfaces"

export function FormField({
  id,
  label,
  error,
  ...inputProps
}: Readonly<FormFieldProps>) {
  const errorId = `${id}-error`

  return (
    <div className="grid gap-2">
      <label className="text-[0.9rem] font-[750] text-[#27324a]" htmlFor={id}>
        {label}
      </label>
      <input
        className="min-h-[3.25rem] w-full rounded-[0.875rem] border border-[#cfd6e4] bg-white px-4 text-[#172033] outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#3569e8] focus:shadow-[0_0_0_0.25rem_rgba(53,105,232,0.12)] aria-invalid:border-[#c73c54]"
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error ? (
        <p id={errorId} className="m-0 text-[0.78rem] leading-6 text-[#b3263e]">
          {error}
        </p>
      ) : null}
    </div>
  )
}

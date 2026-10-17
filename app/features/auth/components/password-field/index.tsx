import { useState } from "react"
import type { PasswordFieldProps } from "./interfaces"

export function PasswordField({
  id,
  label,
  error,
  ...inputProps
}: Readonly<PasswordFieldProps>) {
  const [isVisible, setIsVisible] = useState(false)
  const errorId = `${id}-error`

  function togglePasswordVisibility(): void {
    setIsVisible((current) => !current)
  }

  return (
    <div className="grid gap-2">
      <label className="text-[0.9rem] font-[750] text-[#27324a]" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          className="min-h-[3.25rem] w-full rounded-[0.875rem] border border-[#cfd6e4] bg-white pr-[5.5rem] pl-4 text-[#172033] outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#3569e8] focus:shadow-[0_0_0_0.25rem_rgba(53,105,232,0.12)] aria-invalid:border-[#c73c54]"
          id={id}
          type={isVisible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />
        <button
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-[0.4375rem] text-[0.78rem] font-extrabold text-[#315cc5]"
          type="button"
          onClick={togglePasswordVisibility}
          aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {isVisible ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      {error ? (
        <p id={errorId} className="m-0 text-[0.78rem] leading-6 text-[#b3263e]">
          {error}
        </p>
      ) : null}
    </div>
  )
}

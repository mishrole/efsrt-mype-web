import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "~/shared/components/ui/button"
import { Input } from "~/shared/components/ui/input"
import { cn } from "~/shared/utils/cn"
import type { PasswordFieldProps } from "./interfaces"

export function PasswordField({
  id,
  label,
  error,
  className,
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
        <Input
          {...inputProps}
          id={id}
          type={isVisible ? "text" : "password"}
          className={cn(
            "min-h-[3.25rem] rounded-[0.875rem] border-[#cfd6e4] bg-white pr-[3.75rem] pl-4 text-base text-[#172033]",
            "focus-visible:border-[#3569e8] focus-visible:ring-[#3569e8]/12",
            "aria-invalid:border-[#c73c54] aria-invalid:ring-[#c73c54]/12",
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute inset-y-0 my-auto right-3 size-8 active:translate-y-0 rounded-full p-0 text-[#315cc5] hover:bg-[#eef3ff] hover:text-[#214cae]"
          aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={isVisible}
          onClick={togglePasswordVisibility}
        >
          <span className="relative block size-4" aria-hidden="true">
            <EyeIcon
              className={cn(
                "absolute inset-0 size-4 transition-opacity",
                isVisible ? "opacity-0" : "opacity-100",
              )}
            />

            <EyeOffIcon
              className={cn(
                "absolute inset-0 size-4 transition-opacity",
                isVisible ? "opacity-100" : "opacity-0",
              )}
            />
          </span>
        </Button>
      </div>

      {error ? (
        <p id={errorId} className="m-0 text-[0.78rem] leading-6 text-[#b3263e]">
          {error}
        </p>
      ) : null}
    </div>
  )
}

import { useEffect, useId } from "react"
import { createPortal } from "react-dom"
import type { ModalProps } from "./interfaces"

export function Modal({
  open,
  title,
  children,
  onClose,
  description,
  footer,
  closeLabel = "Cerrar",
}: Readonly<ModalProps>) {
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!open) return

    function closeWithEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", closeWithEscape)

    return function restoreModalEnvironment(): void {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", closeWithEscape)
    }
  }, [onClose, open])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(13,27,54,0.56)] p-0 min-[641px]:p-6"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className="flex h-dvh max-h-none w-full flex-col overflow-hidden rounded-none bg-white text-[#172033] shadow-[0_28px_80px_rgba(10,27,57,0.28)] min-[641px]:h-auto min-[641px]:max-h-[min(760px,calc(100vh-48px))] min-[641px]:w-[min(640px,100%)] min-[641px]:rounded-[20px]"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-6 border-b border-[#e5eaf2] px-6 py-[22px]">
          <div>
            <h2 className="m-0 text-xl" id={titleId}>
              {title}
            </h2>
            {description ? (
              <p className="mt-[7px] mb-0 text-[#748096]" id={descriptionId}>
                {description}
              </p>
            ) : null}
          </div>
          <button
            aria-label={closeLabel}
            className="size-[38px] flex-none cursor-pointer rounded-full border-0 bg-[#f1f4f9] text-[1.4rem] leading-none text-[#44516a]"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="overflow-auto p-6">{children}</div>
        {footer ? (
          <footer className="border-t border-[#e5eaf2] px-6 py-[18px]">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>,
    document.body,
  )
}

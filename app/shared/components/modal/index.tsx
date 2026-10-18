import { XIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/shared/components/ui/dialog"
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
  function handleOpenChange(nextOpen: boolean): void {
    if (!nextOpen) onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-dvh max-h-none w-full max-w-none flex-col gap-0 overflow-hidden rounded-none bg-white p-0 text-[#172033] shadow-[0_28px_80px_rgba(10,27,57,0.28)] ring-0 min-[641px]:h-auto min-[641px]:max-h-[min(760px,calc(100vh-48px))] min-[641px]:w-[min(640px,calc(100%-48px))] min-[641px]:rounded-[20px]"
      >
        <DialogHeader className="flex-row items-start justify-between gap-6 border-b border-[#e5eaf2] px-6 py-[22px] text-left">
          <div>
            <DialogTitle className="m-0 text-xl leading-normal font-bold text-[#172033]">
              {title}
            </DialogTitle>
            {description ? (
              <DialogDescription className="mt-[7px] mb-0 text-base text-[#748096]">
                {description}
              </DialogDescription>
            ) : null}
          </div>
          <button
            aria-label={closeLabel}
            className="grid size-[38px] flex-none cursor-pointer place-items-center rounded-full border-0 bg-[#f1f4f9] text-[#44516a] outline-none hover:bg-[#e7ebf2] focus-visible:ring-2 focus-visible:ring-[#2458d1]/35"
            type="button"
            onClick={onClose}
          >
            <XIcon className="size-5" aria-hidden="true" />
          </button>
        </DialogHeader>
        <div className="overflow-auto p-6">{children}</div>
        {footer ? (
          <DialogFooter className="border-t border-[#e5eaf2] px-6 py-[18px]">
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

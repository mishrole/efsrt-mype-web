import { useEffect, useRef } from "react"
import type { UserMenuProps } from "./interfaces"
import { getUserInitials } from "./utils"

export function UserMenu({
  displayName,
  email,
  open,
  shortcuts,
  onClose,
  onLogout,
}: Readonly<UserMenuProps>) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function closeWithEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") onClose()
    }

    function closeFromOutside(event: PointerEvent): void {
      if (!panelRef.current?.contains(event.target as Node)) onClose()
    }

    document.addEventListener("keydown", closeWithEscape)
    document.addEventListener("pointerdown", closeFromOutside)

    return function removeUserMenuListeners(): void {
      document.removeEventListener("keydown", closeWithEscape)
      document.removeEventListener("pointerdown", closeFromOutside)
    }
  }, [onClose, open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-80 grid h-dvh w-full grid-rows-[auto_1fr_auto] overflow-hidden border-0 bg-white shadow-[0_22px_55px_rgba(22,40,75,0.2)] min-[641px]:absolute min-[641px]:inset-auto min-[641px]:top-[calc(100%+12px)] min-[641px]:right-0 min-[641px]:block min-[641px]:h-auto min-[641px]:w-[min(360px,calc(100vw-28px))] min-[641px]:rounded-[18px] min-[641px]:border min-[641px]:border-[#dfe5ef]"
      ref={panelRef}
      role="dialog"
      aria-label="Menú de usuario"
    >
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-[18px] py-[22px] min-[641px]:p-5">
        <span
          className="grid size-[42px] place-items-center rounded-full bg-[#2458d1] text-[0.72rem] font-[850] text-white"
          aria-hidden="true"
        >
          {getUserInitials(displayName)}
        </span>
        <div className="grid min-w-0">
          <strong className="overflow-hidden text-ellipsis whitespace-nowrap">
            {displayName}
          </strong>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.76rem] text-[#788398]">
            {email}
          </span>
        </div>
        <button
          className="cursor-pointer border-0 bg-transparent text-[1.3rem] text-[#66738a]"
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
        >
          ×
        </button>
      </header>
      <nav
        className="grid content-start border-y border-[#e6eaf1] p-2"
        aria-label="Atajos del sistema"
      >
        {shortcuts.map((shortcut) => (
          <button
            className="grid min-h-11 cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-[10px] border-0 bg-transparent px-3 text-left text-[#34415a] hover:bg-[#f3f6fb]"
            key={shortcut.id}
            type="button"
            disabled={shortcut.disabled}
            onClick={shortcut.onSelect}
          >
            {shortcut.icon}
            <span>{shortcut.label}</span>
            <i aria-hidden="true">›</i>
          </button>
        ))}
        {shortcuts.length === 0 ? (
          <p className="m-3.5 text-center text-[0.78rem] text-[#8490a3]">
            Los próximos módulos aparecerán aquí.
          </p>
        ) : null}
      </nav>
      <footer className="px-[18px] pt-3.5 pb-6 min-[641px]:p-2.5">
        <button
          className="min-h-11 w-full cursor-pointer rounded-[10px] border-0 bg-transparent px-3 text-left font-extrabold text-[#ad2d44] hover:bg-[#fff0f2]"
          type="button"
          onClick={() => void onLogout()}
        >
          Cerrar sesión
        </button>
      </footer>
    </div>
  )
}

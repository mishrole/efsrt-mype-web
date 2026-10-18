import { ChevronRightIcon, LogOutIcon, XIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/shared/components/ui/dropdown-menu"
import type { UserMenuProps } from "./interfaces"
import { getUserInitials } from "./utils"

export function UserMenu({
  displayName,
  email,
  open,
  shortcuts,
  onOpenChange,
  onLogout,
}: Readonly<UserMenuProps>) {
  function closeMenu(): void {
    onOpenChange(false)
  }

  function handleShortcutSelect(onSelect: () => void): void {
    onSelect()
    closeMenu()
  }

  async function handleLogout(): Promise<void> {
    closeMenu()
    await onLogout()
  }

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        aria-label="Abrir menú de usuario"
        className="size-[42px] cursor-pointer rounded-full border border-[#c9d8fb] bg-[#e8efff] text-[0.72rem] font-black text-[#2458d1] outline-none focus-visible:ring-2 focus-visible:ring-[#2458d1]/35"
      >
        {getUserInitials(displayName)}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-[min(360px,calc(100vw-28px))] rounded-[18px] border border-[#dfe5ef] bg-white p-0 text-[#172033] shadow-[0_22px_55px_rgba(22,40,75,0.2)]"
      >
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-5">
          <span
            className="grid size-[42px] place-items-center rounded-full bg-[#2458d1] text-[0.72rem] font-[850] text-white"
            aria-hidden="true"
          >
            {getUserInitials(displayName)}
          </span>

          <span className="grid min-w-0">
            <strong className="overflow-hidden text-ellipsis whitespace-nowrap">
              {displayName}
            </strong>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.76rem] text-[#788398]">
              {email}
            </span>
          </span>

          <button
            className="grid size-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[#66738a] hover:bg-[#f3f6fb] focus-visible:ring-2 focus-visible:ring-[#2458d1]/35 focus-visible:outline-none"
            type="button"
            aria-label="Cerrar menú"
            onClick={closeMenu}
          >
            <XIcon className="size-4" aria-hidden="true" />
          </button>
        </div>
        <DropdownMenuSeparator className="m-0 bg-[#e6eaf1]" />
        <nav className="grid p-2" aria-label="Atajos del sistema">
          {shortcuts.map((shortcut) => (
            <DropdownMenuItem
              className="grid min-h-11 cursor-pointer grid-cols-[auto_1fr_auto] gap-2.5 rounded-[10px] px-3 text-[#34415a] focus:bg-[#f3f6fb] focus:text-[#34415a]"
              key={shortcut.id}
              disabled={shortcut.disabled}
              onClick={() => handleShortcutSelect(shortcut.onSelect)}
            >
              {shortcut.icon}
              <span>{shortcut.label}</span>
              <ChevronRightIcon className="size-4" aria-hidden="true" />
            </DropdownMenuItem>
          ))}
          {shortcuts.length === 0 ? (
            <p className="m-3.5 text-center text-[0.78rem] text-[#8490a3]">
              Los próximos módulos aparecerán aquí.
            </p>
          ) : null}
        </nav>
        <DropdownMenuSeparator className="m-0 bg-[#e6eaf1]" />
        <div className="p-2.5">
          <DropdownMenuItem
            className="min-h-11 cursor-pointer gap-2.5 rounded-[10px] px-3 font-extrabold text-[#ad2d44] focus:bg-[#fff0f2] focus:text-[#ad2d44]"
            onClick={() => void handleLogout()}
          >
            <LogOutIcon className="size-4" aria-hidden="true" />
            Cerrar sesión
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

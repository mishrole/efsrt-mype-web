import { useState } from "react"
import { UserMenu } from "~/shared/components/user-menu"
import { CreateMovementPlaceholder } from "../create-movement-placeholder"
import type { DashboardHeaderProps } from "./interfaces"

export function DashboardHeader({
  businesses,
  currentBusinessId,
  user,
  shortcuts = [],
  onBusinessChange,
  onLogout,
}: Readonly<DashboardHeaderProps>) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [movementModalOpen, setMovementModalOpen] = useState(false)
  const displayName = user?.displayName ?? "Usuario"

  function openMovementModal(): void {
    setMovementModalOpen(true)
  }

  function closeMovementModal(): void {
    setMovementModalOpen(false)
  }

  function handleUserMenuOpenChange(open: boolean): void {
    setUserMenuOpen(open)
  }

  async function handleLogout(): Promise<void> {
    setUserMenuOpen(false)
    await onLogout()
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#e1e6ef] bg-[rgba(255,255,255,0.96)]">
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1420px] items-center justify-between gap-6 px-3.5 min-[721px]:px-6">
        <a
          className="flex items-center gap-2.5 text-[#172641] no-underline"
          href="/"
          aria-label="Ir al inicio de Mype"
        >
          <span
            className="grid size-[38px] place-items-center rounded-[10px] bg-[#2458d1] text-white"
            aria-hidden="true"
          >
            M
          </span>
          <b className="hidden text-[1.18rem] min-[721px]:inline">Mype</b>
        </a>
        <div className="flex items-center gap-2 min-[721px]:gap-3">
          <label className="flex items-center gap-[9px]">
            <span className="hidden text-[0.72rem] font-extrabold text-[#748096] uppercase min-[721px]:inline">
              Negocio
            </span>
            <select
              className="min-h-[42px] max-w-[138px] rounded-[10px] border border-[#d9e0ec] bg-[#f7f9fd] py-0 pr-9 pl-3 text-[#263653] min-[721px]:max-w-none"
              value={currentBusinessId}
              onChange={(event) => onBusinessChange(event.target.value)}
            >
              {businesses.map((business) => (
                <option key={business.businessId} value={business.businessId}>
                  {business.displayName}
                </option>
              ))}
            </select>
          </label>
          <button
            className="flex size-[42px] min-h-[42px] cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-[#2458d1] p-0 font-extrabold text-white min-[721px]:h-auto min-[721px]:w-auto min-[721px]:rounded-[11px] min-[721px]:px-[15px]"
            type="button"
            onClick={openMovementModal}
          >
            <span className="text-xl" aria-hidden="true">
              +
            </span>
            <b className="hidden min-[721px]:inline">Registrar movimiento</b>
          </button>
          <UserMenu
            displayName={displayName}
            email={user?.email ?? ""}
            open={userMenuOpen}
            shortcuts={shortcuts}
            onOpenChange={handleUserMenuOpenChange}
            onLogout={handleLogout}
          />
        </div>
      </div>
      <CreateMovementPlaceholder
        open={movementModalOpen}
        onClose={closeMovementModal}
      />
    </header>
  )
}

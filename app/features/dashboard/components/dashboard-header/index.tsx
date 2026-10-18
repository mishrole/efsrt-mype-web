import { useState } from "react"
import { UserMenu } from "~/shared/components/user-menu"
import { BusinessSelect } from "../business-select"
import { CreateMovementPlaceholder } from "../create-movement-placeholder"
import { NewMenu } from "../new-menu"
import {
  DASHBOARD_PERMISSIONS,
  NEW_ITEM_TYPES,
  type NewItemType,
} from "./constants"
import type { DashboardHeaderProps } from "./interfaces"

export function DashboardHeader({
  businesses,
  currentBusinessId,
  permissions,
  user,
  shortcuts = [],
  onBusinessChange,
  onLogout,
}: Readonly<DashboardHeaderProps>) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [newItemType, setNewItemType] = useState<NewItemType | null>(null)
  const displayName = user?.displayName ?? "Usuario"
  const canCreateMovement = permissions.includes(
    DASHBOARD_PERMISSIONS.movementCreate,
  )
  const canCreateProduct = permissions.includes(
    DASHBOARD_PERMISSIONS.productCreate,
  )

  function openCreation(itemType: NewItemType): void {
    setNewItemType(itemType)
  }

  function closeCreation(): void {
    setNewItemType(null)
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
          <BusinessSelect
            businesses={businesses}
            currentBusinessId={currentBusinessId}
            onChange={onBusinessChange}
          />
          <NewMenu
            canCreateMovement={canCreateMovement}
            canCreateProduct={canCreateProduct}
            onCreateSale={() => openCreation(NEW_ITEM_TYPES.sale)}
            onCreateExpense={() => openCreation(NEW_ITEM_TYPES.expense)}
            onCreateProduct={() => openCreation(NEW_ITEM_TYPES.product)}
          />
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
        open={newItemType !== null}
        itemType={newItemType}
        onClose={closeCreation}
      />
    </header>
  )
}

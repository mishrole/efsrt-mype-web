import { useState } from "react"
import { useNavigate } from "react-router"
import { UserMenu } from "~/shared/components/user-menu"
import { APP_PATHS } from "~/shared/constants/pages"
import { BusinessSelect } from "../business-select"
import { NewMenu } from "../new-menu"
import { DASHBOARD_PERMISSIONS } from "./constants"
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
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const displayName = user?.displayName ?? "Usuario"
  const canCreateMovement = permissions.includes(
    DASHBOARD_PERMISSIONS.movementCreate,
  )
  const canCreateProduct = permissions.includes(
    DASHBOARD_PERMISSIONS.productCreate,
  )

  function createSale(): void {
    void navigate(APP_PATHS.FINANCIAL_MOVEMENT_CREATE("sale"))
  }

  function createExpense(): void {
    void navigate(APP_PATHS.FINANCIAL_MOVEMENT_CREATE("expense"))
  }

  function createProduct(): void {
    void navigate(APP_PATHS.PRODUCT_CREATE)
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
            onCreateSale={createSale}
            onCreateExpense={createExpense}
            onCreateProduct={createProduct}
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
    </header>
  )
}

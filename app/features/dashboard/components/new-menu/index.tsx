import {
  ChevronDownIcon,
  PackagePlusIcon,
  PlusIcon,
  ReceiptTextIcon,
  ShoppingCartIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/shared/components/ui/dropdown-menu"
import type { NewMenuProps } from "./interfaces"

export function NewMenu({
  canCreateMovement,
  canCreateProduct,
  onCreateSale,
  onCreateExpense,
  onCreateProduct,
}: Readonly<NewMenuProps>) {
  if (!canCreateMovement && !canCreateProduct) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Crear nuevo"
        className="flex size-[42px] min-h-[42px] cursor-pointer items-center justify-center gap-1.5 rounded-full border-0 bg-[#2458d1] p-0 font-extrabold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#2458d1]/35 min-[721px]:h-auto min-[721px]:w-auto min-[721px]:rounded-[11px] min-[721px]:px-[13px]"
      >
        <PlusIcon className="size-5" aria-hidden="true" />
        <span className="hidden min-[721px]:inline">Nuevo</span>
        <ChevronDownIcon
          className="hidden size-4 min-[721px]:block"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="min-w-56 rounded-[16px] p-1.5"
      >
        {canCreateMovement ? (
          <>
            <DropdownMenuItem className="cursor-pointer" onClick={onCreateSale}>
              <ShoppingCartIcon aria-hidden="true" />
              Registrar venta
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={onCreateExpense}
            >
              <ReceiptTextIcon aria-hidden="true" />
              Registrar gasto
            </DropdownMenuItem>
          </>
        ) : null}
        {canCreateMovement && canCreateProduct ? (
          <DropdownMenuSeparator />
        ) : null}
        {canCreateProduct ? (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={onCreateProduct}
          >
            <PackagePlusIcon aria-hidden="true" />
            Crear producto
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

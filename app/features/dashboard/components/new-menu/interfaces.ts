export interface NewMenuProps {
  canCreateMovement: boolean
  canCreateProduct: boolean
  onCreateSale: () => void
  onCreateExpense: () => void
  onCreateProduct: () => void
}

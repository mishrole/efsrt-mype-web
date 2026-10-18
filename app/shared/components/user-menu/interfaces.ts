import type { ReactNode } from "react"

export interface UserMenuShortcut {
  id: string
  label: string
  icon?: ReactNode
  onSelect: () => void
  disabled?: boolean
}

export interface UserMenuProps {
  displayName: string
  email: string
  open: boolean
  shortcuts: UserMenuShortcut[]
  onOpenChange: (open: boolean) => void
  onLogout: () => Promise<void>
}

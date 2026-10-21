export interface MovementEvidencesPanelProps {
  businessId: string
  movementId: string
  movementVersion: number
  onMovementChanged: () => Promise<void>
  showHeading?: boolean
}

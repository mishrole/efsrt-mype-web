export interface MovementEvidenceResponse {
  id: string
  movementId: string
  replacesEvidenceId: string | null
  originalFileName: string
  mimeType: string
  sizeBytes: number
  status: number
  removalReason: number | null
  uploadedAt: string
  markedForPurgeAt: string | null
  purgeAfter: string | null
  purgedAt: string | null
  version: number
}

export interface TemporaryEvidenceAccessResponse {
  url: string
  expiresAt: string
}

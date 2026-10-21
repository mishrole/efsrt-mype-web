export interface EvidenceFormDataValues {
  file: File
  movementVersion: number
  evidenceVersion?: number
}

export function createEvidenceFormData({
  file,
  movementVersion,
  evidenceVersion,
}: EvidenceFormDataValues): FormData {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("movementVersion", String(movementVersion))

  if (evidenceVersion !== undefined) {
    formData.append("evidenceVersion", String(evidenceVersion))
  }

  return formData
}

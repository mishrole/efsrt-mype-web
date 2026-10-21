export interface MovementEvidenceUploadFormProps {
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (file: File) => Promise<void>
  onCancel: () => void
}

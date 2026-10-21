export function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`
  }
  const sizeKilobytes = sizeBytes / 1024
  if (sizeKilobytes < 1024) {
    return `${sizeKilobytes.toFixed(1)} KB`
  }
  return `${(sizeKilobytes / 1024).toFixed(1)} MB`
}

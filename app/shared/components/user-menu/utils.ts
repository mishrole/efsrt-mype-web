export function getUserInitials(displayName: string): string {
  const words = displayName.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return "U"
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("")
}

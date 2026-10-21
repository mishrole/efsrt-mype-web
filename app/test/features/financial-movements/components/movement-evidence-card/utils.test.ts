import { describe, expect, it } from "vitest"
import { formatFileSize } from "~/features/financial-movements/components/movement-evidence-card/utils"

describe("formatFileSize", () => {
  it("formats bytes", () => expect(formatFileSize(512)).toBe("512 B"))
  it("formats kilobytes", () => expect(formatFileSize(1536)).toBe("1.5 KB"))
  it("formats megabytes", () => expect(formatFileSize(1572864)).toBe("1.5 MB"))
})

import { describe, expect, it } from "vitest"
import { getUserInitials } from "~/shared/components/user-menu/utils"

describe("getUserInitials", () => {
  it("returns the fallback initial for an empty display name", () => {
    expect(getUserInitials("   ")).toBe("U")
  })

  it("uses at most the first two words", () => {
    expect(getUserInitials("Mitchell Reinhard Rodríguez")).toBe("MR")
  })
})

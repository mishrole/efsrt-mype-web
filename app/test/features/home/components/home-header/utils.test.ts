import { beforeEach, describe, expect, it, vi } from "vitest"
import { scrollToSection } from "../../../../../features/home/components/home-header/utils"

describe("scrollToSection", () => {
  const scrollIntoView = vi.fn()

  beforeEach(() => {
    document.body.innerHTML = ""
    scrollIntoView.mockReset()
    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    })
  })

  it("scrolls smoothly to an existing section", () => {
    const section = document.createElement("section")
    section.id = "beneficios"
    document.body.append(section)

    scrollToSection("beneficios")

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    })
  })

  it("does nothing when the section does not exist", () => {
    scrollToSection("inexistente")

    expect(scrollIntoView).not.toHaveBeenCalled()
  })
})

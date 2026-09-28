// app/test/lib/math.test.ts

import { describe, expect, it } from "vitest"
import { div, max, min, mod, mul, sub, sum } from "~/utils/math"

describe("math", () => {
  it("sum", () => {
    expect(sum(1, 2)).toBe(3)
  })

  it("sub", () => {
    expect(sub(5, 2)).toBe(3)
  })

  it("mul", () => {
    expect(mul(3, 4)).toBe(12)
  })

  it("div", () => {
    expect(div(12, 3)).toBe(4)
  })

  it("mod", () => {
    expect(mod(10, 3)).toBe(1)
  })

  it("max", () => {
    expect(max(10, 3)).toBe(10)
  })

  it("min", () => {
    expect(min(10, 3)).toBe(3)
  })
})

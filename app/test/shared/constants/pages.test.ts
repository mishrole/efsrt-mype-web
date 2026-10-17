import { describe, expect, it } from "vitest"
import { APP_PAGES_ROUTES, APP_PATHS } from "~/shared/constants/pages"

describe("page constants", () => {
  it("defines route segments and absolute paths", () => {
    expect(APP_PAGES_ROUTES).toEqual({
      LOGIN: "login",
      REGISTER: "register",
      DASHBOARD: "dashboard",
    })
    expect(APP_PATHS).toEqual({
      HOME: "/",
      LOGIN: "/login",
      REGISTER: "/register",
      DASHBOARD: "/dashboard",
    })
  })
})

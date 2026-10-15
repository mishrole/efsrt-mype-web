import { describe, expect, it } from "vitest"
import { meta as loginMeta } from "../../features/auth/screens/login"
import { meta as registerMeta } from "../../features/auth/screens/register"
import { meta as homeMeta } from "../../features/home/screens/home"

describe("Page metadata", () => {
  it("defines metadata for Home", () => {
    expect(homeMeta()).toContainEqual({
      title: "Mype | Control financiero para tu negocio",
    })
  })

  it("defines metadata for Login", () => {
    expect(loginMeta()).toContainEqual({
      title: "Iniciar sesión | Mype",
    })
  })

  it("defines metadata for Register", () => {
    expect(registerMeta()).toContainEqual({
      title: "Crear cuenta | Mype",
    })
  })
})

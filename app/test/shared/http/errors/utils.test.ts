import { describe, expect, it } from "vitest"
import {
  createApiError,
  isApiError,
  readApiErrorPayload,
} from "../../../../shared/http/errors/utils"

describe("HTTP error utilities", () => {
  it("creates an API error preserving the server payload", () => {
    const error = createApiError(400, {
      code: "VALIDATION_ERROR",
      message: "La solicitud no es válida.",
      errors: {
        Email: ["El correo es obligatorio."],
      },
    })

    expect(error).toMatchObject({
      name: "ApiError",
      message: "La solicitud no es válida.",
      status: 400,
      code: "VALIDATION_ERROR",
      errors: {
        Email: ["El correo es obligatorio."],
      },
    })
    expect(isApiError(error)).toBe(true)
  })

  it("uses the default message when the payload has no message", () => {
    const error = createApiError(500, {})

    expect(error.message).toBe("No fue posible completar la solicitud.")
    expect(error.status).toBe(500)
  })

  it("does not identify regular errors or arbitrary values as API errors", () => {
    expect(isApiError(new Error("Error ordinario"))).toBe(false)
    expect(isApiError({ status: "401" })).toBe(false)
    expect(isApiError(null)).toBe(false)
  })

  it("reads a valid JSON error payload", async () => {
    const response = new Response(
      JSON.stringify({
        code: "INVALID_CREDENTIALS",
        message: "Credenciales inválidas.",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    await expect(readApiErrorPayload(response)).resolves.toEqual({
      code: "INVALID_CREDENTIALS",
      message: "Credenciales inválidas.",
    })
  })

  it("returns a controlled payload when the response is not valid JSON", async () => {
    const response = new Response("respuesta no JSON", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    })

    await expect(readApiErrorPayload(response)).resolves.toEqual({
      message: "El servidor devolvió una respuesta no válida.",
    })
  })
})

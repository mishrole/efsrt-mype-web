import { beforeEach, describe, expect, it, vi } from "vitest"
import { replaceMovementEvidence } from "~/services/financial-movements/replace-movement-evidence"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import { createEvidenceFormData } from "~/services/financial-movements/evidence-form-data"

vi.mock("~/shared/http/client", () => ({ request: vi.fn() }))
vi.mock("~/services/financial-movements/evidence-form-data", () => ({
  createEvidenceFormData: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe("replaceMovementEvidence", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requestMock.mockResolvedValue({})
  })

  it("uses the evidence contract", async () => {
    const file = new File(["content"], "evidence.png", { type: "image/png" })
    const formData = new FormData()
    vi.mocked(createEvidenceFormData).mockReturnValue(formData)
    const payload = { file, movementVersion: 8, evidenceVersion: 2 }

    await replaceMovementEvidence(
      "business-id",
      "movement-id",
      "evidence-id",
      payload,
      "access-token",
    )

    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.MOVEMENT_EVIDENCE_DETAIL(
        "business-id",
        "movement-id",
        "evidence-id",
      ),
      { method: "PUT", body: formData, accessToken: "access-token" },
    )
    expect(createEvidenceFormData).toHaveBeenCalledWith(payload)
  })
})

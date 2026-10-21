import { beforeEach, describe, expect, it, vi } from "vitest"
import { FINANCIAL_MOVEMENT_TYPES } from "~/features/financial-movements/constants"
import { createFinancialMovementDraft } from "~/services/financial-movements/create-financial-movement-draft"
import { createEvidenceFormData } from "~/services/financial-movements/evidence-form-data"
import { getFinancialMovementDraft } from "~/services/financial-movements/get-financial-movement-draft"
import { listFinancialMovementDrafts } from "~/services/financial-movements/list-financial-movement-drafts"
import { updateFinancialMovementDraft } from "~/services/financial-movements/update-financial-movement-draft"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({
  request: vi.fn(),
}))

const requestMock = vi.mocked(request)
const businessId = "business-id"
const movementId = "movement-id"
const accessToken = "access-token"

const movementResponse = {
  id: movementId,
  businessId,
  type: FINANCIAL_MOVEMENT_TYPES.sale,
  status: 1,
  movementDate: "2026-10-19",
  description: "Venta del turno mañana",
  currencyCode: "PEN",
  totalAmount: 0,
  createdAt: "2026-10-19T14:30:00Z",
  updatedAt: "2026-10-19T14:30:00Z",
  version: 41501,
}

describe("financial movement draft services", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requestMock.mockResolvedValue(movementResponse)
  })

  it("creates a sale draft with only the permitted fields", async () => {
    const payload = {
      type: FINANCIAL_MOVEMENT_TYPES.sale,
      movementDate: "2026-10-19",
      description: "Venta del turno mañana",
    }

    await expect(
      createFinancialMovementDraft(businessId, payload, accessToken),
    ).resolves.toEqual(movementResponse)

    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.FINANCIAL_MOVEMENTS(businessId),
      {
        method: "POST",
        body: payload,
        accessToken,
      },
    )
  })

  it("creates an expense draft without a description", async () => {
    const payload = {
      type: FINANCIAL_MOVEMENT_TYPES.expense,
      movementDate: "2026-10-19",
      description: null,
    }

    await createFinancialMovementDraft(businessId, payload, accessToken)

    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.FINANCIAL_MOVEMENTS(businessId),
      expect.objectContaining({
        method: "POST",
        body: payload,
      }),
    )
  })

  it("lists drafts with the current business scope and abort signal", async () => {
    const abortController = new AbortController()
    requestMock.mockResolvedValueOnce([movementResponse])

    await expect(
      listFinancialMovementDrafts(
        businessId,
        accessToken,
        abortController.signal,
      ),
    ).resolves.toEqual([movementResponse])

    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.FINANCIAL_MOVEMENTS(businessId),
      {
        method: "GET",
        accessToken,
        signal: abortController.signal,
      },
    )
  })

  it("gets the selected draft with the current business scope", async () => {
    const abortController = new AbortController()

    await getFinancialMovementDraft(
      businessId,
      movementId,
      accessToken,
      abortController.signal,
    )

    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.FINANCIAL_MOVEMENT_DETAIL(businessId, movementId),
      {
        method: "GET",
        accessToken,
        signal: abortController.signal,
      },
    )
  })

  it("updates only the editable header and current version", async () => {
    const payload = {
      movementDate: "2026-10-20",
      description: "Venta actualizada",
      version: 41501,
    }

    await updateFinancialMovementDraft(
      businessId,
      movementId,
      payload,
      accessToken,
    )

    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.FINANCIAL_MOVEMENT_DETAIL(businessId, movementId),
      {
        method: "PUT",
        body: payload,
        accessToken,
      },
    )
  })
})

describe("createEvidenceFormData", () => {
  it("creates attachment data without an evidence version", () => {
    const file = new File(["evidence"], "evidence.png", { type: "image/png" })
    const formData = createEvidenceFormData({ file, movementVersion: 7 })

    expect(formData.get("file")).toBe(file)
    expect(formData.get("movementVersion")).toBe("7")
    expect(formData.has("evidenceVersion")).toBe(false)
  })

  it("includes the evidence version while replacing", () => {
    const file = new File(["replacement"], "replacement.pdf", {
      type: "application/pdf",
    })
    const formData = createEvidenceFormData({
      file,
      movementVersion: 8,
      evidenceVersion: 3,
    })

    expect(formData.get("file")).toBe(file)
    expect(formData.get("movementVersion")).toBe("8")
    expect(formData.get("evidenceVersion")).toBe("3")
  })
})
